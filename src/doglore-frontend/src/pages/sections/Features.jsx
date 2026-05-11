// src/sections/Features.jsx
import { Link } from 'react-router-dom';

export default function Features() {
    return (
        <section className="py-20 px-6 md:px-16">
            <span className="bg-brand-accent/20 text-brand-earth text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Наші можливості
            </span>
            <h2 className="h2 mt-4 mb-12">Інструменти для кожного господаря</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Енциклопедія - тепер це Link, щоб весь блок був клікабельним */}
                <Link
                    to="/encyclopedia"
                    className="md:col-span-2 bg-white p-10 rounded-[32px] flex justify-between items-center shadow-sm border border-surface-primary hover:shadow-md transition-all group"
                >
                    <div className="max-w-xs">
                        <div className="w-10 h-10 bg-surface-positive/30 flex items-center justify-center rounded-lg mb-4 text-brand-primary">📚</div>
                        <h3 className="h2 text-2xl mb-4">Енциклопедія</h3>
                        <p className="text-sm text-text-secondary mb-6">
                            Велика база знань про породи, поведінку та здоров'я вашого улюбленця...
                        </p>
                        {/* Стилізована кнопка "Читати далі" */}
                        <span className="text-brand-primary font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                            Читати далі <span>➔</span>
                        </span>
                    </div>
                    <div className="hidden sm:block w-48 h-48 rounded-2xl overflow-hidden">
                        <img src="/dog-portrait.jpg" alt="Dog" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                </Link>

                {/* Трекінг - також зробимо клікабельним на сторінку тренувань */}
                <Link
                    to="/training"
                    className="bg-brand-primary p-10 rounded-[32px] text-white hover:bg-brand-secondary transition-all shadow-sm flex flex-col justify-between"
                >
                    <div>
                        <div className="w-10 h-10 bg-white/10 flex items-center justify-center rounded-lg mb-4">🐾</div>
                        <h3 className="text-2xl font-bold mb-4">Трекінг</h3>
                        <p className="text-white/80 text-sm mb-10">Слідкуйте за активністю, графіком вакцинації та харчуванням...</p>
                    </div>
                    <div className="w-24 h-24 border-8 border-white/20 border-t-white rounded-full mx-auto flex items-center justify-center">
                        <span className="font-bold">85%</span>
                    </div>
                </Link>

            </div>
        </section>
    );
}