import { useState } from 'react';
import { fmtDt } from '../utils/formatters';

export function Crises({ crises, onAdd, onRemove }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ data: '', dur: '', intens: 3, tipo: 'Convulsão', sint: '', gatilho: '', med: '' });

  function handleSave() {
    if (!form.data) return;
    onAdd(form);
    setForm({ data: '', dur: '', intens: 3, tipo: 'Convulsão', sint: '', gatilho: '', med: '' });
    setOpen(false);
  }

  return (
    <div className="section-content">
      <div className="section-title">Diário de Crises</div>

      {crises.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📋</div>
          Nenhuma crise registrada ainda
        </div>
      ) : (
        crises.map(c => {
          const intens = parseInt(c.intens || 3);
          const intensColor = intens <= 2 ? 'var(--green-dark)' : intens <= 3 ? '#7a5a00' : 'var(--red-dark)';
          const intensBg = intens <= 2 ? 'var(--green-soft)' : intens <= 3 ? 'var(--gold-soft)' : 'var(--red-soft)';
          return (
            <div className="card" key={c.id}>
              <div className="card-header">
                <div>
                  <div className="card-title">{c.tipo}</div>
                  <div className="card-sub">{fmtDt(c.data)}</div>
                </div>
                <div className="card-actions">
                  <span className="badge" style={{ background: intensBg, color: intensColor }}>Intensidade {c.intens}/5</span>
                  <button className="delete-btn" onClick={() => { if (window.confirm('Remover este registro?')) onRemove(c.id); }}>remover</button>
                </div>
              </div>
              <div className="detail-row">
                {c.dur && <div className="detail-item">Duração: <span>{c.dur}</span></div>}
                {c.gatilho && <div className="detail-item">Gatilho: <span>{c.gatilho}</span></div>}
                {c.med && <div className="detail-item">Medicamento: <span>{c.med}</span></div>}
              </div>
              {c.sint && <div className="card-note">{c.sint}</div>}
            </div>
          );
        })
      )}

      <button className="add-btn" onClick={() => setOpen(o => !o)}>＋ Registrar crise</button>

      {open && (
        <div className="form-overlay open">
          <div className="form-box">
            <div className="form-row"><label>Data e hora</label><input type="datetime-local" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} /></div>
            <div className="form-row"><label>Duração estimada</label><input value={form.dur} onChange={e => setForm(f => ({ ...f, dur: e.target.value }))} placeholder="Ex: 2 minutos" /></div>
            <div className="form-row">
              <label>Intensidade</label>
              <div className="range-row">
                <span className="range-label">Leve</span>
                <input type="range" min="1" max="5" value={form.intens} onChange={e => setForm(f => ({ ...f, intens: e.target.value }))} />
                <span className="range-label">Forte</span>
                <span className="range-val">{form.intens}</span>
              </div>
            </div>
            <div className="form-row">
              <label>Tipo de crise</label>
              <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
                <option>Convulsão</option><option>Crise alérgica</option>
                <option>Crise respiratória</option><option>Crise comportamental</option><option>Outro</option>
              </select>
            </div>
            <div className="form-row"><label>Sintomas observados</label><textarea value={form.sint} onChange={e => setForm(f => ({ ...f, sint: e.target.value }))} placeholder="O que aconteceu, comportamento da Nala…" /></div>
            <div className="form-row"><label>Gatilho possível</label><input value={form.gatilho} onChange={e => setForm(f => ({ ...f, gatilho: e.target.value }))} placeholder="Ex: após comer, após passeio…" /></div>
            <div className="form-row"><label>Medicamento administrado</label><input value={form.med} onChange={e => setForm(f => ({ ...f, med: e.target.value }))} placeholder="Deixe em branco se não administrou" /></div>
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
