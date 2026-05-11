// src/pages/DogProfile.jsx
import Sidebar from './components/Sidebar';
import Navbar from './layout/Navbar';

export default function DogProfile() {
    return (
        <div className="min-h-screen bg-bg-main">
            <Navbar />
            <div className="flex">
                <Sidebar />

                <main className="flex-1 p-8 md:p-12 space-y-8">

                    {/* БЛОК 1: Заголовок профілю з фото та швидкою статистикою */}
                    <section className="bg-white p-8 rounded-[40px] shadow-sm border border-surface-primary flex flex-col md:flex-row gap-10 items-center">
                        <div className="w-64 h-64 rounded-[32px] overflow-hidden">
                            <img src="/buddy-large.jpg" alt="Buddy" className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 w-full">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-5xl font-bold font-montserrat text-text-primary mb-2">Бадді</h1>
                                    <p className="text-text-muted font-medium italic">Золотистий ретривер • 3 роки</p>
                                </div>
                                <span className="bg-brand-accent/20 text-brand-earth text-[10px] font-bold px-4 py-1.5 rounded-full uppercase">Активний та здоровий</span>
                            </div>

                            {/* Швидка статистика (Вага, Зріст і т.д.) */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Вага', value: '32.4 кг' },
                                    { label: 'Зріст', value: '58 см' },
                                    { label: 'Активність', value: 'Висока' },
                                    { label: 'Здоров’я', value: '❤️', isIcon: true },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-bg-main p-4 rounded-2xl border border-surface-primary/50 text-center">
                                        <p className="text-[10px] text-text-muted uppercase mb-1">{stat.label}</p>
                                        <p className={`font-bold ${stat.isIcon ? 'text-xl' : 'text-lg'}`}>{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Нижня сітка: Деталі, Графік та Галерея */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-text-primary">

                        {/* Ліва колонка (Деталі та Вакцинація) - 4/12 */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-surface-primary">
                                <h3 className="text-xl font-bold mb-6 font-montserrat">Деталі</h3>
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between py-2 border-b border-surface-primary/30">
                                        <span className="text-text-muted">Стать</span>
                                        <span className="font-bold">Самець</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-surface-primary/30">
                                        <span className="text-text-muted">Чіп</span>
                                        <span className="font-bold">#900215000</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-text-muted">Харчування</span>
                                        <span className="font-bold">Сухий корм</span>
                                    </div>
                                </div>
                            </div>

                            {/* Картка вакцинації */}
                            <div className="bg-brand-primary p-8 rounded-[32px] text-white">
                                <p className="text-white/60 text-[10px] uppercase font-bold mb-2">Наступне щеплення</p>
                                <h4 className="text-xl font-bold mb-6">24 Березня, 2024 (Сказ)</h4>
                                <button className="w-full bg-white text-brand-primary py-3 rounded-xl font-bold hover:bg-opacity-90">
                                    Нагадати мені
                                </button>
                            </div>
                        </div>

                        {/* Права колонка (Графік та Галерея) - 8/12 */}
                        <div className="lg:col-span-8 space-y-8">

                            {/* Щоденник росту (Спрощений графік) */}
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-surface-primary">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-bold font-montserrat">Щоденник росту</h3>
                                    <div className="flex gap-2 text-[10px] font-bold">
                                        <span className="bg-brand-primary text-white px-3 py-1 rounded-full cursor-pointer">Вага</span>
                                        <span className="bg-bg-main px-3 py-1 rounded-full cursor-pointer">Зріст</span>
                                    </div>
                                </div>

                                {/* Імітація графіка стовпчиками */}
                                <div className="flex items-end justify-between h-48 gap-2">
                                    {[40, 55, 45, 80, 60, 90, 75].map((height, i) => (
                                        <div key={i} className="flex flex-col items-center flex-1 gap-2">
                                            <div className="w-full bg-surface-positive/40 rounded-t-lg transition-all hover:bg-brand-primary" style={{ height: `${height}%` }}></div>
                                            <span className="text-[10px] text-text-muted font-bold">
                                                {['Січ', 'Лют', 'Бер', 'Квіт', 'Трав', 'Черв', 'Лип'][i]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Галерея */}
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-surface-primary">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold font-montserrat text-text-primary">Галерея</h3>
                                    <button className="text-brand-primary text-xs font-bold hover:underline">Всі фото ➔</button>
                                </div>

                                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                                    {[
                                        { img: '/pup-1.jpg', tag: '2 міс' },
                                        { img: '/pup-2.jpg', tag: '1 рік' },
                                        { img: '/pup-3.jpg', tag: '2 роки' },
                                    ].map((item, i) => (
                                        <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden shadow-sm">
                                            <img src={item.img} className="w-full h-full object-cover transition transform group-hover:scale-105" alt="Gallery" />
                                            <span className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-md text-white text-[8px] px-2 py-1 rounded-md font-bold">
                                                {item.tag}
                                            </span>
                                        </div>
                                    ))}
                                    {/* Кнопка "Додати фото" */}
                                    <div className="border-2 border-dashed border-surface-primary rounded-2xl flex items-center justify-center cursor-pointer hover:bg-bg-main transition">
                                        <span className="text-surface-dark/40 text-xl">📷</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}