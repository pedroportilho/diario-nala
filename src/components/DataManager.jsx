import { useRef, useState } from 'react';

export function DataManager({ state, onImport }) {
  const inputRef = useRef(null);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  // ── Exportar ───────────────────────────────────────────────
  function handleExport() {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const a = document.createElement('a');
    a.href = url;
    a.download = `nala-agenda-${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Importar ───────────────────────────────────────────────
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setImportError('');
    setImportSuccess(false);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);

        // Valida estrutura mínima esperada
        const keys = ['vacinas', 'consultas', 'crises', 'medicacoes', 'treinos'];
        const valid = keys.every(k => Array.isArray(parsed[k]));

        if (!valid) {
          setImportError('Arquivo inválido. Certifique-se de importar um backup da Agenda da Nala.');
          return;
        }

        if (!window.confirm('Isso vai substituir todos os dados atuais pelo arquivo importado. Deseja continuar?')) {
          return;
        }

        onImport(parsed);
        setImportSuccess(true);
        setTimeout(() => setImportSuccess(false), 3000);
      } catch {
        setImportError('Não foi possível ler o arquivo. Verifique se é um JSON válido.');
      }
    };
    reader.readAsText(file);

    // Limpa o input para permitir importar o mesmo arquivo novamente
    e.target.value = '';
  }

  const total = Object.values(state).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <div className="data-manager">
      <div className="dm-header">
        <div className="dm-title">💾 Backup dos Dados</div>
        <div className="dm-subtitle">
          {total} registro{total !== 1 ? 's' : ''} salvo{total !== 1 ? 's' : ''} no momento
        </div>
      </div>

      <div className="dm-summary">
        {Object.entries(state).map(([key, arr]) => {
          const icons = { vacinas: '💉', consultas: '🏥', crises: '📋', medicacoes: '💊', treinos: '🏃' };
          const labels = { vacinas: 'Vacinas', consultas: 'Consultas', crises: 'Crises', medicacoes: 'Medicações', treinos: 'Treinos' };
          return (
            <div className="dm-stat" key={key}>
              <span className="dm-stat-icon">{icons[key]}</span>
              <span className="dm-stat-count">{arr.length}</span>
              <span className="dm-stat-label">{labels[key]}</span>
            </div>
          );
        })}
      </div>

      <div className="dm-actions">
        <button className="dm-btn dm-btn-export" onClick={handleExport}>
          <span className="dm-btn-icon">⬇️</span>
          <div>
            <div className="dm-btn-title">Exportar backup</div>
            <div className="dm-btn-desc">Baixa um arquivo .json com todos os dados</div>
          </div>
        </button>

        <button className="dm-btn dm-btn-import" onClick={() => inputRef.current?.click()}>
          <span className="dm-btn-icon">⬆️</span>
          <div>
            <div className="dm-btn-title">Importar backup</div>
            <div className="dm-btn-desc">Restaura dados de um arquivo .json salvo</div>
          </div>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      {importError && (
        <div className="dm-alert dm-alert-error">⚠️ {importError}</div>
      )}
      {importSuccess && (
        <div className="dm-alert dm-alert-success">✓ Dados importados com sucesso!</div>
      )}

      <div className="dm-tip">
        💡 Dica: Exporte regularmente para ter um backup seguro dos dados da Nala.
      </div>
    </div>
  );
}
