import { useState } from 'react';
import { fmt } from '../utils/formatters';

export function Vacinas({ vacinas, onAdd, onRemove, isPast, isExpiring }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: '', data: '', proxima: '', vet: '', obs: '' });

  function handleSave() {
    if (!form.nome.trim()) return;
    onAdd(form);
    setForm({ nome: '', data: '', proxima: '', vet: '', obs: '' });
    setOpen(false);
  }

  return (
    <div className="section-content">
      <div className="section-title">Registro de Vacinas</div>

      {vacinas.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">💉</div>
          Nenhuma vacina registrada ainda
        </div>
      ) : (
        vacinas.map(v => {
          const past = isPast(v.proxima);
          const soon = isExpiring(v.proxima);
          const badgeClass = past ? 'badge-alert' : soon ? 'badge-warn' : v.proxima ? 'badge-ok' : 'badge-gray';
          const badgeTxt = past ? 'Vencida' : soon ? 'Vence em breve' : v.proxima ? 'Em dia' : 'Sem retorno';
          return (
            <div className="card" key={v.id}>
              <div className="card-header">
                <div>
                  <div className="card-title">{v.nome}</div>
                  <div className="card-sub">Aplicada em {fmt(v.data)}</div>
                </div>
                <div className="card-actions">
                  <span className={`badge ${badgeClass}`}>{badgeTxt}</span>
                  <button className="delete-btn" onClick={() => { if (window.confirm('Remover este registro?')) onRemove(v.id); }}>remover</button>
                </div>
              </div>
              <div className="detail-row">
                {v.proxima && <div className="detail-item">Próxima dose: <span>{fmt(v.proxima)}</span></div>}
                {v.vet && <div className="detail-item">Veterinário: <span>{v.vet}</span></div>}
                {v.obs && <div className="detail-item">Obs: <span>{v.obs}</span></div>}
              </div>
            </div>
          );
        })
      )}

      <button className="add-btn" onClick={() => setOpen(o => !o)}>＋ Adicionar vacina</button>

      {open && (
        <div className="form-overlay open">
          <div className="form-box">
            <div className="form-row"><label>Vacina</label><input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: V10, Antirrábica…" /></div>
            <div className="form-row"><label>Data de aplicação</label><input type="date" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} /></div>
            <div className="form-row"><label>Próxima dose</label><input type="date" value={form.proxima} onChange={e => setForm(f => ({ ...f, proxima: e.target.value }))} /></div>
            <div className="form-row"><label>Veterinário / Clínica</label><input value={form.vet} onChange={e => setForm(f => ({ ...f, vet: e.target.value }))} placeholder="Nome ou clínica" /></div>
            <div className="form-row"><label>Observações</label><textarea value={form.obs} onChange={e => setForm(f => ({ ...f, obs: e.target.value }))} placeholder="Reações, lote…" /></div>
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
