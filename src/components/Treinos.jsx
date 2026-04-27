import { useState } from 'react';
import { fmt, starRating } from '../utils/formatters';

export function Treinos({ treinos, onAdd, onRemove }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ data: '', tipo: 'Passeio', dur: '', perf: 3, cmd: '', obs: '' });

  function handleSave() {
    if (!form.data) return;
    onAdd(form);
    setForm({ data: '', tipo: 'Passeio', dur: '', perf: 3, cmd: '', obs: '' });
    setOpen(false);
  }

  return (
    <div className="section-content">
      <div className="section-title">Diário de Treinos</div>

      {treinos.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🏃</div>
          Nenhum treino registrado ainda
        </div>
      ) : (
        treinos.map(t => (
          <div className="card" key={t.id}>
            <div className="card-header">
              <div>
                <div className="card-title">{t.tipo}</div>
                <div className="card-sub">{fmt(t.data)}{t.dur ? ' · ' + t.dur : ''}</div>
              </div>
              <div className="card-actions">
                <span style={{ fontSize: 15 }}>{starRating(t.perf)}</span>
                <button className="delete-btn" onClick={() => { if (window.confirm('Remover este registro?')) onRemove(t.id); }}>remover</button>
              </div>
            </div>
            {t.cmd && <div className="detail-row"><div className="detail-item">Comandos: <span>{t.cmd}</span></div></div>}
            {t.obs && <div className="card-note">{t.obs}</div>}
          </div>
        ))
      )}

      <button className="add-btn" onClick={() => setOpen(o => !o)}>＋ Registrar treino</button>

      {open && (
        <div className="form-overlay open">
          <div className="form-box">
            <div className="form-row"><label>Data</label><input type="date" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} /></div>
            <div className="form-row">
              <label>Tipo de treino</label>
              <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
                <option>Passeio</option><option>Obediência básica</option><option>Socialização</option>
                <option>Agilidade</option><option>Nosework</option><option>Livre</option><option>Outro</option>
              </select>
            </div>
            <div className="form-row"><label>Duração</label><input value={form.dur} onChange={e => setForm(f => ({ ...f, dur: e.target.value }))} placeholder="Ex: 30 minutos" /></div>
            <div className="form-row">
              <label>Desempenho geral</label>
              <div className="range-row">
                <span className="range-label">Difícil</span>
                <input type="range" min="1" max="5" value={form.perf} onChange={e => setForm(f => ({ ...f, perf: e.target.value }))} />
                <span className="range-label">Ótimo</span>
                <span className="range-val">{starRating(form.perf)}</span>
              </div>
            </div>
            <div className="form-row"><label>Comandos praticados</label><input value={form.cmd} onChange={e => setForm(f => ({ ...f, cmd: e.target.value }))} placeholder="Ex: Senta, fica, pé…" /></div>
            <div className="form-row"><label>Observações</label><textarea value={form.obs} onChange={e => setForm(f => ({ ...f, obs: e.target.value }))} placeholder="Como foi o treino, dificuldades, conquistas…" /></div>
            <div className="form-actions">
              <button className="btn-cancel" onClick={() => setOpen(false)}>Cancelar</button>
              <button className="btn-save" onClick={handleSave}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
