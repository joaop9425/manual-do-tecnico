import React, { useState, useMemo, useCallback, useEffect } from 'react';

// Hook de debounce (exemplo, pode ser importado de uma biblioteca de utilitários)
const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

interface NewsItem {
    id: string;
    slug: string;
    data: {
        title: string;
        source: string;
        sourceUrl: string;
        pubDate: Date | string;
        category: string;
        revision?: string;
        excerpt?: string;
        tags?: string[];
    };
}

interface Props {
    initialNews: NewsItem[];
    availableCategories: string[];
    base?: string;
}

// Sub-componente para o botão de categoria
const CategoryButton: React.FC<{ category: string | null; isSelected: boolean; onClick: () => void }> = React.memo(
    ({ category, isSelected, onClick }) => {
        const buttonText = category === null ? 'Todos' : category;
        const className = `whitespace-nowrap px-5 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${
            isSelected
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                : 'bg-white border border-surface-200 text-surface-500 hover:border-brand-200'
        }`;
        return (
            <button
                onClick={onClick}
                className={className}
                aria-pressed={isSelected}
                aria-label={category === null ? 'Mostrar todas as notícias' : `Filtrar por categoria: ${category}`}
            >
                {buttonText}
            </button>
        );
    }
);

// Sub-componente para o cartão de notícia
const NewsCard: React.FC<{ item: NewsItem; base: string }> = React.memo(({ item, base }) => {
    const formattedDate = useMemo(() => {
        return new Date(item.data.pubDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', timeZone: 'UTC' });
    }, [item.data.pubDate]);

    return (
        <article
            key={item.id}
            className="group flex flex-col bg-white rounded-3xl border border-surface-200 overflow-hidden hover:border-brand-200 hover:shadow-2xl hover:shadow-brand-500/5 transition-all duration-500"
        >
            <div className="p-6 md:p-8 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black bg-brand-50 text-brand-600 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                            {item.data.source}
                        </span>
                        <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest border-l border-surface-200 pl-3">
                            {item.data.category}
                        </span>
                    </div>
                    <time className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">
                        {formattedDate}
                    </time>
                </div>

                <div className="flex-grow">
                    <h2 className="text-lg md:text-xl font-bold text-surface-950 group-hover:text-brand-600 transition-colors leading-tight mb-4 tracking-tight">
                        <a href={`${base}noticias/${item.slug}`} aria-label={`Ler notícia: ${item.data.title}`}>
                            {item.data.title}
                        </a>
                    </h2>
                    <p className="text-sm text-surface-500 leading-relaxed line-clamp-3">
                        {item.data.excerpt || "Acesse para ler o conteúdo completo desta atualização técnica."}
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-surface-100 flex items-center justify-between">
                    <a
                        href={`${base}noticias/${item.slug}`}
                        className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors uppercase tracking-widest"
                        aria-label={`Ver documentação local de ${item.data.title}`}
                    >
                        Documentação Local
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </a>
                </div>
            </div>
        </article>
    );
});

export default function NewsExplorer({ initialNews, availableCategories, base = '' }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    // Usar o hook de debounce para o termo de busca
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const filteredNews = useMemo(() => {
        const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase();

        return initialNews.filter((item) => {
            const matchesSearch =
                item.data.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.data.excerpt?.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.data.tags?.some(t => t.toLowerCase().includes(lowerCaseSearchTerm)); // Adicionado busca por tags

            const matchesCategory = selectedCategory ? item.data.category === selectedCategory : true;

            return matchesSearch && matchesCategory;
        });
    }, [debouncedSearchTerm, selectedCategory, initialNews]);

    // Reset page to 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm, selectedCategory]);

    const totalPages = useMemo(() => Math.ceil(filteredNews.length / ITEMS_PER_PAGE), [filteredNews]);

    const paginatedNews = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredNews.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredNews, currentPage, ITEMS_PER_PAGE]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 300, behavior: 'smooth' });
    }, []);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, []);

    const handleCategoryClick = useCallback((category: string | null) => {
        setSelectedCategory(category);
    }, []);

    return (
        <div className="space-y-12">
            {/* SEARCH & FILTERS BAR */}
            <div className="sticky top-20 z-40 bg-white pt-4 pb-6 border-b border-surface-200 -mx-6 px-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Search Input */}
                    <div className="relative w-full md:max-w-md group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-400 group-focus-within:text-brand-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar nas notícias..."
                            className="w-full bg-white border border-surface-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all outline-none"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            aria-label="Campo de busca de notícias"
                        />
                    </div>

                    {/* Category Pills (Desktop) / Select (Mobile) */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-4 md:pb-2" style={{ scrollbarWidth: 'thin' }}>
                        <CategoryButton
                            category={null}
                            isSelected={selectedCategory === null}
                            onClick={() => handleCategoryClick(null)}
                        />
                        {availableCategories.map((cat) => (
                            <CategoryButton
                                key={cat}
                                category={cat}
                                isSelected={selectedCategory === cat}
                                onClick={() => handleCategoryClick(cat)}
                            />
                        ))}
                    </div>
                </div>

                {/* Results Counter */}
                <div className="mt-4 text-[10px] font-bold text-surface-400 uppercase tracking-widest">
                    Exibindo {filteredNews.length} resultados {debouncedSearchTerm && `para "${debouncedSearchTerm}"`}
                </div>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-10">
                {paginatedNews.length > 0 ? (
                    paginatedNews.map((item) => (
                        <NewsCard key={item.id} item={item} base={base} />
                    ))
                ) : (
                    <div className="py-24 text-center col-span-full"> {/* col-span-full para centralizar em todas as colunas */}
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface-100 text-surface-400 mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-surface-900 mb-2">Nenhum resultado encontrado</h3>
                        <p className="text-surface-500">Tente ajustar sua busca ou mudar os filtros de categoria.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCategory(null); setCurrentPage(1); }}
                            className="mt-6 text-brand-500 font-bold hover:underline"
                            aria-label="Limpar todos os filtros de busca e categoria"
                        >
                            Limpar todos os filtros
                        </button>
                    </div>
                )}
            </div>

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12 border-t border-surface-200">
                    <div className="text-sm font-medium text-surface-500 order-2 sm:order-1">
                        Página <span className="text-surface-950 font-bold">{currentPage}</span> de <span className="text-surface-950 font-bold">{totalPages}</span>
                    </div>

                    <div className="flex items-center gap-2 order-1 sm:order-2">
                        <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="p-2.5 rounded-xl border border-surface-200 bg-white text-surface-600 hover:border-brand-500 hover:text-brand-500 disabled:opacity-30 disabled:hover:border-surface-200 disabled:hover:text-surface-600 transition-all shadow-sm"
                            aria-label="Página anterior"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum = 1;
                                if (totalPages <= 5) pageNum = i + 1;
                                else if (currentPage <= 3) pageNum = i + 1;
                                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                else pageNum = currentPage - 2 + i;

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${currentPage === pageNum
                                            ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                                            : 'bg-white border border-surface-200 text-surface-600 hover:border-brand-200'
                                            }`}
                                        aria-label={`Ir para a página ${pageNum}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2.5 rounded-xl border border-surface-200 bg-white text-surface-600 hover:border-brand-500 hover:text-brand-500 disabled:opacity-30 disabled:hover:border-surface-200 disabled:hover:text-surface-600 transition-all shadow-sm"
                            aria-label="Próxima página"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
