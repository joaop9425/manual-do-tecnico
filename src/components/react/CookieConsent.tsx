import React, { useState, useEffect } from 'react';

interface Props {
    base?: string;
}

export default function CookieConsent({ base = '' }: Props) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[1000] animate-in slide-in-from-bottom-10 fade-in duration-700">
            <div className="bg-white/90 backdrop-blur-2xl border border-surface-200 p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-brand-500/20">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-lg text-surface-950 tracking-tight">Privacidade e Cookies</h3>
                    </div>

                    <p className="text-sm text-surface-600 leading-relaxed">
                        Usamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa
                        <a href={`${base}privacidade`} className="text-brand-600 font-bold hover:underline mx-1">Política de Privacidade</a>.
                    </p>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            onClick={handleAccept}
                            className="flex-1 bg-surface-950 text-white text-xs font-bold uppercase tracking-widest py-4 rounded-2xl hover:bg-brand-600 transition-all shadow-lg shadow-surface-950/20"
                        >
                            Aceitar Tudo
                        </button>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="px-6 py-4 text-xs font-bold text-surface-400 hover:text-surface-950 transition-colors uppercase tracking-widest"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
