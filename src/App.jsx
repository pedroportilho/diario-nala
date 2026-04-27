import { useState } from 'react';
import { useNalaStore } from './hooks/useNalaStore';
import { Vacinas } from './components/Vacinas';
import { Consultas } from './components/Consultas';
import { Crises } from './components/Crises';
import { Medicacoes } from './components/Medicacoes';
import { Treinos } from './components/Treinos';
import { DataManager } from './components/DataManager';
import './App.css';
import nala from './images/nala.jpeg'

const TABS = [
  { id: 'vacinas',    label: '💉 Vacinas' },
  { id: 'consultas',  label: '🏥 Consultas' },
  { id: 'crises',     label: '📋 Crises' },
  { id: 'medicacoes', label: '💊 Medicações' },
  { id: 'treinos',    label: '🏃 Treinos' },
  { id: 'backup',     label: '💾 Backup' },
];

const NASCIMENTO = new Date('2023-07-04');

function calcularIdade(nascimento) {
  const hoje = new Date();
  const anos = hoje.getFullYear() - nascimento.getFullYear();
  const meses = hoje.getMonth() - nascimento.getMonth();
  const dias = hoje.getDate() - nascimento.getDate();

  let anosTotal = anos;
  let mesesTotal = meses < 0 || (meses === 0 && dias < 0) ? meses + 12 : meses;
  if (meses < 0 || (meses === 0 && dias < 0)) anosTotal--;

  if (anosTotal === 0) {
    return `${mesesTotal} ${mesesTotal === 1 ? 'mês' : 'meses'}`;
  }
  if (mesesTotal === 0) {
    return `${anosTotal} ${anosTotal === 1 ? 'ano' : 'anos'}`;
  }
  return `${anosTotal} ${anosTotal === 1 ? 'ano' : 'anos'} e ${mesesTotal} ${mesesTotal === 1 ? 'mês' : 'meses'}`;
}

function SaveNotice({ show }) {
  return <div className={`save-notice ${show ? 'show' : ''}`}>✓ Salvo com sucesso!</div>;
}

export default function App() {
  const [tab, setTab] = useState('vacinas');
  const [saveNotice, setSaveNotice] = useState(false);
  const { state, add, remove, update, toggleMedicacao, importData, isExpiring, isPast } = useNalaStore();

  const idade = calcularIdade(NASCIMENTO);

  function handleAdd(section, item) {
    add(section, item);
    showNotice();
  }

  function handleRemove(section, id) {
    remove(section, id);
    showNotice();
  }

  function handleUpdate(section, id, dados) {
    update(section, id, dados);
    showNotice();
  }

  function handleToggle(id) {
    toggleMedicacao(id);
    showNotice();
  }

  function showNotice() {
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 2200);
  }

  return (
    <>
      {/* Hero */}
      <div className="hero">
        <div className="hero-card">
          <img className="hero-photo" src={nala} alt="Nala" />
          <div className="hero-info">
            <div className="hero-name">Nala</div>
            <div className="hero-breed">Border Collie</div>
            <div className="hero-tags">
              <span className="hero-tag">🎂 {idade}</span>
              <span className="hero-tag">🐾 Fêmea</span>
              <span className="hero-tag">⭐ Agenda de Saúde</span>
            </div>
          </div>
          <div className="hero-paw">🐾</div>
        </div>
      </div>

      {/* App */}
      <div className="app">
        {/* Tabs */}
        <div className="tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Seções */}
        {tab === 'vacinas' && (
          <Vacinas
            vacinas={state.vacinas}
            onAdd={item => handleAdd('vacinas', item)}
            onRemove={id => handleRemove('vacinas', id)}
            onUpdate={(id, dados) => handleUpdate('vacinas', id, dados)}
            isPast={isPast}
            isExpiring={isExpiring}
          />
        )}
        {tab === 'consultas' && (
          <Consultas
            consultas={state.consultas}
            onAdd={item => handleAdd('consultas', item)}
            onRemove={id => handleRemove('consultas', id)}
            onUpdate={(id, dados) => handleUpdate('consultas', id, dados)}
          />
        )}
        {tab === 'crises' && (
          <Crises
            crises={state.crises}
            onAdd={item => handleAdd('crises', item)}
            onRemove={id => handleRemove('crises', id)}
            onUpdate={(id, dados) => handleUpdate('crises', id, dados)}
          />
        )}
        {tab === 'medicacoes' && (
          <Medicacoes
            medicacoes={state.medicacoes}
            onAdd={item => handleAdd('medicacoes', item)}
            onRemove={id => handleRemove('medicacoes', id)}
            onUpdate={(id, dados) => handleUpdate('medicacoes', id, dados)}
            onToggle={handleToggle}
          />
        )}
        {tab === 'treinos' && (
          <Treinos
            treinos={state.treinos}
            onAdd={item => handleAdd('treinos', item)}
            onRemove={id => handleRemove('treinos', id)}
            onUpdate={(id, dados) => handleUpdate('treinos', id, dados)}
          />
        )}
        {tab === 'backup' && (
          <DataManager state={state} onImport={importData} />
        )}
      </div>

      <SaveNotice show={saveNotice} />
    </>
  );
}
