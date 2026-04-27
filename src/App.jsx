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

function SaveNotice({ show }) {
  return <div className={`save-notice ${show ? 'show' : ''}`}>✓ Salvo com sucesso!</div>;
}

export default function App() {
  const [tab, setTab] = useState('vacinas');
  const [saveNotice, setSaveNotice] = useState(false);
  const { state, add, remove, toggleMedicacao, importData, isExpiring, isPast } = useNalaStore();

  function handleAdd(section, item) {
    add(section, item);
    showNotice();
  }

  function handleRemove(section, id) {
    remove(section, id);
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
          <img class="hero-photo" src={nala} alt="Nala" />
          <div className="hero-info">
            <div className="hero-name">Nala</div>
            <div className="hero-breed">Border Collie</div>
            <div className="hero-tags">
              <span className="hero-tag">🎂 04/07/2023</span>
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
            isPast={isPast}
            isExpiring={isExpiring}
          />
        )}
        {tab === 'consultas' && (
          <Consultas
            consultas={state.consultas}
            onAdd={item => handleAdd('consultas', item)}
            onRemove={id => handleRemove('consultas', id)}
          />
        )}
        {tab === 'crises' && (
          <Crises
            crises={state.crises}
            onAdd={item => handleAdd('crises', item)}
            onRemove={id => handleRemove('crises', id)}
          />
        )}
        {tab === 'medicacoes' && (
          <Medicacoes
            medicacoes={state.medicacoes}
            onAdd={item => handleAdd('medicacoes', item)}
            onRemove={id => handleRemove('medicacoes', id)}
            onToggle={handleToggle}
          />
        )}
        {tab === 'treinos' && (
          <Treinos
            treinos={state.treinos}
            onAdd={item => handleAdd('treinos', item)}
            onRemove={id => handleRemove('treinos', id)}
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
