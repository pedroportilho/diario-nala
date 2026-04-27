import { useState } from 'react';
import { fmt } from '../utils/formatters';

export function Medicacoes({ medicacoes, onAdd, onRemove, onToggle }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: '', dose: '', freq: '1x ao dia', inicio: '', fim: '', motivo: '', obs: '' });

  function handleSave() {
    if (!form.nome.trim()) return;
    onAdd({ ...form, ativa: true });
    setForm({ nome: '', dose: '', freq: '1x ao dia', inicio: '', fim: '', motivo: '', obs: '' });
    setOpen(false);
  }

  const ativas = medicacoes.filter(m => m.ativa);
  const inativas = medicacoes.filter(m => !m.ativa);

  const renderCard = (m) => (
    <div className="card" key={m.id} style={!m.ativa ? { opacity: 0.55 } : {}}>
      <div className="card-header">
        <div>
          <div className="card-title">{m.nome}</div>
          <div className="card-sub">{m.dose} · {m.freq}</div>
        </div>
        <div className="card-actions">
          <button
            className={`med-toggle ${m.ativa ? 'on' : ''}`}
            onClick={() => onToggle(m.id)}
            title={m.ativa ? 'Pausar' : 'Ativar'}
          />
          <button className="delete-btn" onClick={() => { if (window.confirm('Remover este registro?')) onRemove(m.id); }}>remover</button>
        </div>
      </div>
      <div className="detail-row">
        {m.inicio && <div className="detail-item">Início: <span>{fmt(m.inicio)}</span></div>}
        {m.fim && <div className="detail-item">Fim: <span>{fmt(m.fim)}</span></div>}
        {m.motivo && <div className="detail-item">Para: <span>{m.motivo}</span></div>}
      </div>
      {m.obs && <div className="card-note">{m.obs}</div>}
    </div>
  );

  return (
    <div className="section-content">
      <div className="section-title">Medicações em Uso</div>

      {medicacoes.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">💊</div>
          Nenhuma medicação registrada ainda
        </div>
      ) : (
        <>
          {ativas.map(renderCard)}
          {inativas.length > 0 && (
            <>
              <div className="section-title" style={{ marginTop: '1rem' }}>Pausadas</div>
              {inativas.map(renderCard)}
            </>
          )}
        </>
      )}

      <button className="add-btn" onClick={() => setOpen(o => !o)}>＋ Adicionar medicação</button>

      {open && (
        <div className="form-overlay open">
          <div className="form-box">
            <div className="form-row"><label>Medicamento</label><input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Nome do medicamento" /></div>
            <div className="form-row"><label>Dose</label><input value={form.dose} onChange={e => setForm(f => ({ ...f, dose: e.target.value }))} placeholder="Ex: 10mg, 1 comprimido…" /></div>
            <div className="form-row">
              <label>Frequência</label>
              <select value={form.freq} onChange={e => setForm(f => ({ ...f, freq: e.target.value }))}>
                <option>1x ao dia</option><option>2x ao dia</option><option>3x ao dia</option>
                <option>A cada 8h</option><option>A cada 12h</option><option>Semanal</option>
                <option>Conforme necessário</option>
              </select>
            </div>
            <div className="form-row"><label>Início do tratamento</label><input type="date" value={form.inicio} onChange={e => setForm(f => ({ ...f, inicio: e.target.value }))} /></div>
            <div className="form-row"><label>Fim previsto</label><input type="date" value={form.fim} onChange={e => setForm(f => ({ ...f, fim: e.target.value }))} /></div>
            <div className="form-row"><label>Indicação / Motivo</label><input value={form.motivo} onChange={e => setForm(f => ({ ...f, motivo: e.target.value }))} placeholder="Para que serve" /></div>
            <div className="form-row"><label>Observações</label><textarea value={form.obs} onChange={e => setForm(f => ({ ...f, obs: e.target.value }))} placeholder="Reações, cuidados…" /></div>
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
