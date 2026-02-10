import React, { useState } from 'react';

const COMPONENTS = [
    { name: 'CPU (Mid-Range)', watts: 65 },
    { name: 'CPU (High-End)', watts: 125 },
    { name: 'GPU (Mid-Range)', watts: 200 },
    { name: 'GPU (High-End)', watts: 350 },
    { name: 'Motherboard', watts: 50 },
    { name: 'RAM (per stick)', watts: 5 },
    { name: 'SSD/HDD', watts: 10 },
    { name: 'Fans (each)', watts: 3 },
];

export default function PsuCalculator() {
    const [selectedItems, setSelectedItems] = useState([]);

    const totalWatts = selectedItems.reduce((acc, item) => acc + item.watts, 0);
    const recommendedPsu = Math.ceil((totalWatts * 1.5) / 50) * 50;

    const addItem = (item) => {
        setSelectedItems([...selectedItems, item]);
    };

    const removeItem = (index) => {
        const newItems = [...selectedItems];
        newItems.splice(index, 1);
        setSelectedItems(newItems);
    };

    return (
        <div className="bg-white rounded-3xl border border-surface-200 shadow-clean overflow-hidden">
            <div className="p-8 border-b border-surface-100 flex justify-between items-center bg-surface-50/50">
                <span className="text-xs font-bold uppercase tracking-widest text-surface-400">Configuração de Carga</span>
                <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-full px-3 underline decoration-brand-200">Total: {totalWatts}W</span>
            </div>

            <div className="p-8 space-y-8">
                {/* ADD SECTION */}
                <div className="space-y-4">
                    <label className="text-sm font-bold text-surface-950 uppercase tracking-tight">Adicionar Componente</label>
                    <div className="grid grid-cols-2 gap-3">
                        {COMPONENTS.map((comp) => (
                            <button
                                key={comp.name}
                                onClick={() => addItem(comp)}
                                className="text-xs font-semibold border border-surface-200 rounded-xl px-4 py-3 text-left hover:border-brand-500 hover:bg-brand-50 transition-all flex justify-between items-center group"
                            >
                                <span>{comp.name}</span>
                                <span className="text-surface-400 group-hover:text-brand-500 opacity-50">+</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* LIST SECTION */}
                <div className="space-y-4">
                    <label className="text-sm font-bold text-surface-950 uppercase tracking-tight">Manifesto do Sistema</label>
                    <div className="bg-surface-50 rounded-2xl p-4 min-h-[120px] max-h-[160px] overflow-y-auto border border-surface-100">
                        {selectedItems.length > 0 ? (
                            <ul className="space-y-2">
                                {selectedItems.map((item, idx) => (
                                    <li key={idx} className="flex justify-between items-center text-xs font-medium text-surface-600 group">
                                        <span>{item.name} <span className="text-surface-400 ml-2 font-normal">({item.watts}W)</span></span>
                                        <button onClick={() => removeItem(idx)} className="text-surface-300 hover:text-red-500 transition-colors">Remover</button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-surface-300 italic text-center py-6">Nenhum componente selecionado.</p>
                        )}
                    </div>
                </div>

                {/* RESULT SECTION */}
                <div className="pt-6 border-t border-surface-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="text-center sm:text-left">
                        <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Fonte Recomendada</span>
                        <div className="text-4xl font-bold text-brand-600 tabular-nums">
                            {Math.max(recommendedPsu, 300)}<span className="text-xl ml-1">Watts</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setSelectedItems([])}
                        className="text-xs font-bold text-surface-400 hover:text-surface-950 transition-all uppercase tracking-wider"
                    >
                        Limpar Configuração
                    </button>
                </div>
            </div>
        </div>
    );
}
