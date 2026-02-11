import React, { useState, useMemo } from 'react';

interface ContentItem {
    id: string;
    slug: string;
    data: {
        title: string;
        description: string;
        category: string;
        tags: string[];
        publishDate: Date | string;
        image?: string;
        author?: string;
    };
}

interface Props {
    initialContent: ContentItem[];
    availableCategories: string[];
    base?: string;
}

export default function ContentExplorer({ initialContent, availableCategories, base = '' }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredContent = useMemo(() => {
        return initialContent.filter((item) => {
            const matchesSearch =
                item.data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.data.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.data.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesCategory = selectedCategory ? item.data.category === selectedCategory : true;

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory, initialContent]);

    return (
        <div className="space-y-12">
            {/* SEARCH & FILTERS BAR */}
            <div className="sticky top-20 z-40 bg-surface-50/80 backdrop-blur-md pt-4 pb-6 border-b border-surface-200 -mx-6 px-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:max-w-md group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-400 group-focus-within:text-brand-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar manuais e guias..."
                            className="w-full bg-white border border-surface-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`whitespace-nowrap px-5 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${selectedCategory === null
                                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                                : 'bg-white border border-surface-200 text-surface-500 hover:border-brand-200'
                                }`}
                        >
                            Todos
                        </button>
                        {availableCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`whitespace-nowrap px-5 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${selectedCategory === cat
                                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                                    : 'bg-white border border-surface-200 text-surface-500 hover:border-brand-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContent.map((item) => (
                    <a
                        key={item.id}
                        href={`${base}conteudos/${item.slug}`}
                        className="group flex flex-col bg-white rounded-3xl border border-surface-100 overflow-hidden hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-1 transition-all duration-300"
                    >
                        {item.data.image && (
                            <div className="aspect-video overflow-hidden border-b border-surface-50">
                                <img
                                    src={item.data.image.startsWith('http') ? item.data.image : `${base}${item.data.image.startsWith('/') ? item.data.image.slice(1) : item.data.image}`}
                                    alt={item.data.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        )}
                        <div className="p-6 md:p-8 space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                                    {item.data.category}
                                </span>
                                <span className="text-[10px] font-medium text-surface-400 uppercase tracking-widest">
                                    {new Date(item.data.publishDate).getFullYear()}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-surface-950 group-hover:text-brand-600 transition-colors leading-tight">
                                {item.data.title}
                            </h3>
                            <p className="text-sm text-surface-500 line-clamp-3 leading-relaxed">
                                {item.data.description}
                            </p>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {item.data.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="text-[9px] font-bold text-surface-400 bg-surface-50 px-2 py-0.5 rounded uppercase tracking-tighter">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            {filteredContent.length === 0 && (
                <div className="py-24 text-center">
                    <h3 className="text-xl font-bold text-surface-900 mb-2">Nenhum manual encontrado</h3>
                    <p className="text-surface-500">Tente buscar por termos mais genéricos ou mudar a categoria.</p>
                </div>
            )}
        </div>
    );
}
