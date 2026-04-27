import { useState, useEffect } from 'react';

const KEY = 'nala_agenda_v2';

const initialState = {
  vacinas: [],
  consultas: [],
  crises: [],
  medicacoes: [],
  treinos: []
};

export function useNalaStore() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(KEY);
      return saved ? JSON.parse(saved) : initialState;
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      alert('Não foi possível salvar. Verifique se o armazenamento local está habilitado.');
    }
  }, [state]);

  function add(section, item) {
    setState(prev => ({
      ...prev,
      [section]: [{ ...item, id: Date.now() }, ...prev[section]]
    }));
  }

  function remove(section, id) {
    setState(prev => ({
      ...prev,
      [section]: prev[section].filter(x => x.id !== id)
    }));
  }

  function update(section, id, dadosNovos) {
    setState(prev => ({
      ...prev,
      [section]: prev[section].map(item =>
        item.id === id ? { ...item, ...dadosNovos } : item
      )
    }));
  }

  function toggleMedicacao(id) {
    setState(prev => ({
      ...prev,
      medicacoes: prev.medicacoes.map(m =>
        m.id === id ? { ...m, ativa: !m.ativa } : m
      )
    }));
  }

  function importData(newState) {
    setState(newState);
  }

  function isExpiring(dateStr) {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const diff = (d - new Date()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 30;
  }

  function isPast(dateStr) {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  }

  return { state, add, remove, update, toggleMedicacao, importData, isExpiring, isPast };
}
