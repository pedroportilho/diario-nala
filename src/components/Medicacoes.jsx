import { useState } from 'react';
import { fmt } from '../utils/formatters';

const MDR1_DROGAS = [
  { nome: 'Ivermectina', categoria: 'Antiparasitário', risco: 'alto', obs: 'Presente em muitos antipulgas/carrapatos e vermífugos. Causa neurotoxicidade grave.' },
  { nome: 'Milbemicina oxima', categoria: 'Antiparasitário', risco: 'alto', obs: 'Usada em produtos como Interceptor e Sentinel.' },
  { nome: 'Moxidectina', categoria: 'Antiparasitário', risco: 'alto', obs: 'Presente em produtos como Advantage Multi e Guardian.' },
  { nome: 'Selamectina', categoria: 'Antiparasitário', risco: 'alto', obs: 'Presente no Revolution. Pode causar tremores e convulsões.' },
  { nome: 'Loperamida', categoria: 'Antidiarreico', risco: 'alto', obs: 'Imódio e similares. Causa depressão do sistema nervoso central.' },
  { nome: 'Acepromazina', categoria: 'Sedativo', risco: 'alto', obs: 'Sedativo muito usado em cirurgias. Causa hipotensão severa e sedação prolongada.' },
  { nome: 'Butorfanol', categoria: 'Opioide', risco: 'moderado', obs: 'Opioide analgésico. Efeitos amplificados em cães MDR1+.' },
  { nome: 'Vincristina', categoria: 'Quimioterápico', risco: 'alto', obs: 'Usado no tratamento de cânceres. Toxicidade aumentada.' },
  { nome: 'Doxorrubicina', categoria: 'Quimioterápico', risco: 'alto', obs: 'Quimioterápico comum. Níveis plasmáticos muito elevados em MDR1+.' },
  { nome: 'Ciclosporina', categoria: 'Imunossupressor', risco: 'moderado', obs: 'Usada para dermatite atópica (Atopica). Monitoramento rigoroso necessário.' },
  { nome: 'Digoxina', categoria: 'Cardíaco', risco: 'moderado', obs: 'Medicamento cardíaco. Acumulação excessiva no organismo.' },
  { nome: 'Quinidina', categoria: 'Antiarrítmico', risco: 'moderado', obs: 'Antiarrítmico. Concentração plasmática elevada.' },
  { nome: 'Morfina', categoria: 'Opioide', risco: 'moderado', obs: 'Analgésico opioide. Sedação prolongada e efeitos amplificados.' },
  { nome: 'Metoclopramida', categoria: 'Antiemético', risco: 'moderado', obs: 'Usado para náuseas. Efeitos sobre SNC amplificados.' },
  { nome: 'Domperidona', categoria: 'Antiemético', risco: 'moderado', obs: 'Antiemético. Monitorar sinais neurológicos.' },
  { nome: 'Espiramicina', categoria: 'Antibiótico', risco: 'moderado', obs: 'Antibiótico macrolídeo. Substrato da P-gp.' },
];

const RISCO_CONFIG = {
  alto: { label: 'Alto risco', badgeClass: 'badge-alert' },
  moderado: { label: 'Moderado', badgeClass: 'badge-warn' },
};

export function Medicacoes({ medicacoes, onAdd, onRemove, onUpdate, onToggle }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: '', dose: '', freq: '1x ao dia', inicio: '', fim: '', motivo: '', obs: '' });
  const [editando, setEditando] = useState(null);
  const [showMdr1, setShowMdr1] = useState(false);

  function handleSave() {
    if (!form.nome.trim()) return;
    onAdd({ ...form, ativa: true });
    setForm({ nome: '', dose: '', freq: '1x ao dia', inicio: '', fim: '', motivo: '', obs: '' });
    setOpen(false);
  }

  function handleSaveEdit() {
    if (!editando.nome.trim()) return;
    onUpdate(editando.id, editando);
    setEditando(null);
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
          <button className="edit-btn" onClick={() => setEditando({ ...m })}>editar</button>
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

      {/* Seção MDR1 */}
      <div style={{ marginTop: '24px' }}>
        <button
          className="add-btn"
          style={{ borderStyle: 'solid', borderColor: 'var(--red-dark)', color: 'var(--red-dark)', background: 'var(--red-soft)' }}
          onClick={() => setShowMdr1(o => !o)}
        >
          ⚠️ {showMdr1 ? 'Ocultar' : 'Ver'} medicamentos proibidos — MDR1 / Border Collie
        </button>

        {showMdr1 && (
          <div className="form-box" style={{ marginTop: '8px', background: '#fff8f8' }}>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--red-dark)', marginBottom: '4px' }}>
                ⚠️ Atenção — Mutação MDR1 (ABCB1)
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Border Collies têm alta prevalência da mutação no gene MDR1, que compromete a barreira hematoencefálica. 
                Os medicamentos abaixo podem causar neurotoxicidade grave mesmo em doses normais. 
                <strong> Informe sempre seu veterinário sobre essa predisposição antes de qualquer tratamento.</strong>
              </div>
            </div>

            {['alto', 'moderado'].map(nivel => (
              <div key={nivel} style={{ marginBottom: '16px' }}>
                <div className="section-title" style={{ marginBottom: '8px', color: nivel === 'alto' ? 'var(--red-dark)' : '#7a5a00' }}>
                  {nivel === 'alto' ? '🔴 Alto risco — evitar completamente' : '🟡 Risco moderado — usar com cautela'}
                </div>
                {MDR1_DROGAS.filter(d => d.risco === nivel).map(d => (
                  <div key={d.nome} className="card" style={{ marginBottom: '8px', borderColor: nivel === 'alto' ? '#f5c6c6' : '#f5e6c6' }}>
                    <div className="card-header" style={{ marginBottom: 4 }}>
                      <div>
                        <div className="card-title" style={{ fontSize: '14px' }}>{d.nome}</div>
                        <div className="card-sub">{d.categoria}</div>
                      </div>
                      <span className={`badge ${RISCO_CONFIG[d.risco].badgeClass}`}>{RISCO_CONFIG[d.risco].label}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{d.obs}</div>
                  </div>
                ))}
              </div>
            ))}

            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', fontStyle: 'italic' }}>
              Lista baseada em estudos sobre o gene ABCB1 (MDR1) em cães. Consulte sempre um veterinário antes de administrar qualquer medicamento.
            </div>
          </div>
        )}
      </div>

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

      {/* Modal de edição */}
      {editando && (
        <div className="modal-overlay open" onClick={() => setEditando(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Editar Medicação</span>
              <button className="modal-close" onClick={() => setEditando(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-row"><label>Medicamento</label><input value={editando.nome} onChange={e => setEditando(f => ({ ...f, nome: e.target.value }))} /></div>
              <div className="form-row"><label>Dose</label><input value={editando.dose || ''} onChange={e => setEditando(f => ({ ...f, dose: e.target.value }))} placeholder="Ex: 10mg, 1 comprimido…" /></div>
              <div className="form-row">
                <label>Frequência</label>
                <select value={editando.freq || '1x ao dia'} onChange={e => setEditando(f => ({ ...f, freq: e.target.value }))}>
                  <option>1x ao dia</option><option>2x ao dia</option><option>3x ao dia</option>
                  <option>A cada 8h</option><option>A cada 12h</option><option>Semanal</option>
                  <option>Conforme necessário</option>
                </select>
              </div>
              <div className="form-row"><label>Início do tratamento</label><input type="date" value={editando.inicio || ''} onChange={e => setEditando(f => ({ ...f, inicio: e.target.value }))} /></div>
              <div className="form-row"><label>Fim previsto</label><input type="date" value={editando.fim || ''} onChange={e => setEditando(f => ({ ...f, fim: e.target.value }))} /></div>
              <div className="form-row"><label>Indicação / Motivo</label><input value={editando.motivo || ''} onChange={e => setEditando(f => ({ ...f, motivo: e.target.value }))} placeholder="Para que serve" /></div>
              <div className="form-row"><label>Observações</label><textarea value={editando.obs || ''} onChange={e => setEditando(f => ({ ...f, obs: e.target.value }))} placeholder="Reações, cuidados…" /></div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setEditando(null)}>Cancelar</button>
              <button className="btn-save" onClick={handleSaveEdit}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
