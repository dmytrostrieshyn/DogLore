// src/pages/Training.jsx
import Sidebar from './components/Sidebar';
import Navbar from './layout/Navbar';

export default function Training() {
    return (
        <div className="min-h-screen bg-bg-main">
            <Navbar />
            <div className="flex">
                <Sidebar />

                <main className="flex-1 p-8 md:p-12">
                    <h1 className="h1 text-3xl mb-2">Прогрес дресирування</h1>
                    <p className="body-standard text-sm mb-10">Відстеження розвитку Бадді та нових навичок...</p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Ліва частина: Активні команди та Примітки */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Картка команд */}
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-surface-primary">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-bold font-montserrat">Активні команди</h3>
                                    <span className="bg-brand-accent/20 text-brand-earth text-[10px] font-bold px-3 py-1 rounded-full">3 Goals This Week</span>
                                </div>

                                <div className="space-y-6">
                                    {/* Рядок команди (можна винести в окремий компонент) */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm font-bold">
                                            <div className="flex items-center gap-2"><input type="checkbox" checked readOnly className="accent-brand-primary" /> Сидіти</div>
                                            <span className="text-text-muted">100% Mastery</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full"><div className="h-full bg-brand-primary w-full rounded-full" /></div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm font-bold">
                                            <div className="flex items-center gap-2"><input type="checkbox" className="accent-brand-primary" /> Стояти (30 секунд)</div>
                                            <span className="text-text-muted text-[10px]">65% Mastery</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full"><div className="h-full bg-brand-accent w-[65%] rounded-full" /></div>
                                    </div>
                                </div>
                            </div>

                            {/* Примітки */}
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-surface-primary">
                                <h3 className="text-xl font-bold mb-4 font-montserrat">Примітки до тренувань</h3>
                                <textarea
                                    className="w-full bg-bg-main rounded-2xl p-4 text-sm focus:outline-none border border-transparent focus:border-brand-light-sage min-h-[150px]"
                                    placeholder="Сьогодні Бадді добре реагує на смачні ласощі..."
                                />
                                <div className="flex justify-end mt-4">
                                    <button className="bg-brand-secondary text-white px-8 py-2 rounded-full font-bold">Зберегти</button>
                                </div>
                            </div>

                        </div>

                        {/* Права частина: Календар та Ціль */}
                        <div className="space-y-8">
                            {/* Календар (спрощено) */}
                            <div className="bg-brand-secondary text-white p-6 rounded-[32px]">
                                <h4 className="text-center font-bold mb-4">Жовтень 2026</h4>
                                <div className="grid grid-cols-7 gap-2 text-[10px] text-center opacity-80">
                                    <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                                    {/* Тут буде логіка календаря, поки просто цифри */}
                                    <div className="py-2">29</div><div className="py-2">30</div><div className="py-2">1</div>
                                    <div className="py-2 bg-brand-accent rounded-full text-brand-primary font-bold">2</div>
                                </div>
                            </div>

                            {/* Рекламна картка цілі */}
                            <div className="relative overflow-hidden rounded-[32px] aspect-square group">
                                <img src="/hand-dog.jpg" className="absolute inset-0 w-full h-full object-cover transition transform group-hover:scale-105" alt="Goal" />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 to-transparent p-6 flex flex-col justify-end text-white">
                                    <h4 className="font-bold text-lg leading-tight mb-2">Нова ціль: Без повідця</h4>
                                    <p className="text-[10px] opacity-80 mb-4">Вам залишилося всього 4 заняття до початку тренувань...</p>
                                    <button className="text-xs font-bold underline text-left">Дізнатися більше</button>
                                </div>
                            </div>

                            {/* Додати нову команду (dashed border) */}
                            <div className="border-2 border-dashed border-surface-primary rounded-[32px] p-8 text-center flex flex-col items-center justify-center gap-4 hover:bg-white transition cursor-pointer">
                                <div className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-brand-primary">➕</div>
                                <p className="text-xs font-bold text-text-primary">Тренувати нову команду</p>
                                <p className="text-[10px] text-text-muted">Поруч, Дай лапу або Перевернись</p>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}