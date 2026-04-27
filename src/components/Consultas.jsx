import { useState } from 'react';
import { fmt } from '../utils/formatters';

export function Consultas({ consultas, onAdd, onRemove }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ tipo: '', data: '', vet: '', motivo: '', diag: '', proxima: '' });

  function handleSave() {
    if (!form.tipo.trim()) return;
    onAdd(form);
    setForm({ tipo: '', data: '', vet: '', motivo: '', diag: '', proxima: '' });
    setOpen(false);
  }

  return (
    <div className="section-content">
      <div className="section-title">Histórico de Consultas</div>

      {consultas.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🏥</div>
          Nenhuma consulta registrada ainda
        </div>
      ) : (
        consultas.map(c => (
          <div className="card" key={c.id}>
            <div className="card-header">
              <div>
                <div className="card-title">{c.tipo}</div>
                <div className="card-sub">{fmt(c.data)}{c.vet ? ' · ' + c.vet : ''}</div>
              </div>
              <div className="card-actions">
                {c.proxima && <span className="badge badge-info">Retorno {fmt(c.proxima)}</span>}
                <button className="delete-btn" onClick={() => { if (window.confirm('Remover este registro?')) onRemove(c.id); }}>remover</button>
              </div>
            </div>
            {c.motivo && <div className="detail-row"><div className="detail-item">Motivo: <span>{c.motivo}</span></div></div>}
            {c.diag && <div className="card-note">{c.diag}</div>}
          </div>
        ))
      )}

      <button className="add-btn" onClick={() => setOpen(o => !o)}>＋ Adicionar consulta</button>

      {open && (
        <div className="form-overlay open">
          <div className="form-box">
            <div className="form-row"><label>Tipo de consulta</label><input value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))} placeholder="Ex: Rotina, Retorno, Emergência…" /></div>
            <div className="form-row"><label>Data</label><input type="date" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} /></div>
            <div className="form-row"><label>Veterinário / Clínica</label><input value={form.vet} onChange={e => setForm(f => ({ ...f, vet: e.target.value }))} placeholder="Nome ou clínica" /></div>
            <div className="form-row"><label>Motivo</label><input value={form.motivo} onChange={e => setForm(f => ({ ...f, motivo: e.target.value }))} placeholder="Motivo da consulta" /></div>
            <div className="form-row"><label>Diagnóstico / Resultado</label><textarea value={form.diag} onChange={e => setForm(f => ({ ...f, diag: e.target.value }))} placeholder="O que foi identificado…" /></div>
            <div className="form-row"><label>Próxima consulta</label><input type="date" value={form.proxima} onChange={e => setForm(f => ({ ...f, proxima: e.target.value }))} /></div>
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
