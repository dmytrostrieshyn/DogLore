import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './layout/Navbar';
// Імпортуємо ваші функції з dogsApi
import { fetchDogFullProfile, fetchDogWeightHistory } from '../services/api/dogsApi';

export default function DogProfile() {
    const [dog, setDog] = useState(null);
    const [weightHistory, setWeightHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const dogId = auth.currentUser?.uid;

    useEffect(() => {
        if (dogId) {
            Promise.all([
                fetchDogFullProfile(dogId),
                fetchDogWeightHistory(dogId)
            ]).then(([profileData, historyData]) => {
                setDog(profileData);
                setWeightHistory(historyData || []);
                setLoading(false);
            }).catch(err => {
                console.error("Помилка завантаження профілю:", err);
                setLoading(false);
            });
        }
    }, [dogId]);

    if (loading) return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center font-bold">
            🐾 Завантаження профілю Бадді...
        </div>
    );

    if (!dog) return <div className="p-10 text-center font-bold text-red-500 font-montserrat">Профіль собаки не знайдено. Будь ласка, завершіть реєстрацію.</div>;

    return (
        <div className="min-h-screen bg-bg-main">
            <Navbar />
            <div className="flex">
                <Sidebar />

                <main className="flex-1 p-8 md:p-12 space-y-8">

                    {/* БЛОК 1: Заголовок профілю з фото та швидкою статистикою */}
                    <section className="bg-white p-8 rounded-[40px] shadow-sm border border-surface-primary flex flex-col md:flex-row gap-10 items-center">
                        <div className="w-64 h-64 rounded-[32px] overflow-hidden shadow-xl ring-8 ring-bg-main">
                            <img 
                                src={dog.avatarUrl || "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=500"} 
                                alt={dog.dogName} 
                                className="w-full h-full object-cover" 
                            />
                        </div>

                        <div className="flex-1 w-full text-center md:text-left">
                            <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-6">
                                <div>
                                    <h1 className="text-5xl font-bold font-montserrat text-text-primary mb-2 uppercase tracking-tighter">
                                        {dog.dogName}
                                    </h1>
                                    <p className="text-text-muted font-medium italic">
                                        {dog.dogBreed} • {dog.dogAge} роки
                                    </p>
                                </div>
                                <span className="mt-4 md:mt-0 bg-brand-accent/20 text-brand-earth text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                                    Активний та здоровий
                                </span>
                            </div>

                            {/* Швидка статистика */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Вага', value: `${dog.currentWeight || weightHistory[weightHistory.length - 1]?.value || '--'} кг` },
                                    { label: 'Зріст', value: `${dog.dogHeight || '--'} см` },
                                    { label: 'Активність', value: dog.activityLevel || 'Висока' },
                                    { label: 'Здоров’я', value: '❤️', isIcon: true },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-bg-main p-4 rounded-2xl border border-surface-primary/50 text-center hover:scale-105 transition-transform cursor-default">
                                        <p className="text-[10px] text-text-muted uppercase mb-1 font-bold">{stat.label}</p>
                                        <p className={`font-bold font-montserrat ${stat.isIcon ? 'text-xl' : 'text-lg'}`}>{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Нижня сітка */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-text-primary">

                        {/* Ліва колонка */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-surface-primary">
                                <h3 className="text-xl font-bold mb-6 font-montserrat">Деталі</h3>
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between py-2 border-b border-surface-primary/30">
                                        <span className="text-text-muted font-bold uppercase text-[10px]">Стать</span>
                                        <span className="font-bold">{dog.gender || 'Самець'}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-surface-primary/30">
                                        <span className="text-text-muted font-bold uppercase text-[10px]">Чіп</span>
                                        <span className="font-bold">{dog.chipNumber || '#Не вказано'}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-text-muted font-bold uppercase text-[10px]">Харчування</span>
                                        <span className="font-bold">{dog.foodType || 'Сухий корм'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-brand-primary p-8 rounded-[32px] text-white shadow-lg relative overflow-hidden group">
                                <div className="relative z-10">
                                    <p className="text-white/60 text-[10px] uppercase font-bold mb-2">Наступне щеплення</p>
                                    <h4 className="text-xl font-bold mb-6 font-montserrat">{dog.nextVaccination || '24 Травня, 2026 (Сказ)'}</h4>
                                    <button className="w-full bg-white text-brand-primary py-3 rounded-xl font-bold hover:bg-bg-main transition-colors">
                                        Нагадати мені
                                    </button>
                                </div>
                                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
                            </div>
                        </div>

                        {/* Права колонка */}
                        <div className="lg:col-span-8 space-y-8">

                            {/* Щоденник росту */}
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-surface-primary">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-bold font-montserrat uppercase tracking-tight">Щоденник росту</h3>
                                    <div className="flex gap-2 text-[10px] font-bold">
                                        <span className="bg-brand-primary text-white px-3 py-1 rounded-full shadow-md">Вага</span>
                                        <span className="bg-bg-main px-3 py-1 rounded-full text-text-muted opacity-50">Зріст</span>
                                    </div>
                                </div>

                                <div className="flex items-end justify-between h-48 gap-4 px-4">
                                    {weightHistory.length > 0 ? weightHistory.slice(-7).map((entry, i) => (
                                        <div key={i} className="flex flex-col items-center flex-1 gap-2 group">
                                            <div 
                                                className="w-full bg-surface-positive/40 rounded-t-xl transition-all hover:bg-brand-primary relative cursor-pointer" 
                                                style={{ height: `${(entry.value / 40) * 100}%` }}
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {entry.value}кг
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-text-muted font-bold uppercase">
                                                {entry.label}
                                            </span>
                                        </div>
                                    )) : (
                                        <p className="w-full text-center text-text-muted italic text-sm">Дані про вагу відсутні...</p>
                                    )}
                                </div>
                            </div>

                            {/* Галерея */}
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-surface-primary">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold font-montserrat text-text-primary">Галерея</h3>
                                    <button className="text-brand-primary text-xs font-bold hover:underline">Всі фото ➔</button>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {(dog.gallery || [
                                        { img: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eca3?auto=format&fit=crop&q=80&w=200', tag: 'Цуценя' },
                                        { img: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=200', tag: '1 рік' },
                                    ]).map((item, i) => (
                                        <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden shadow-sm border border-bg-main">
                                            <img src={item.img} className="w-full h-full object-cover transition transform group-hover:scale-110 duration-500" alt="Gallery" />
                                            <span className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md text-white text-[8px] px-2 py-1 rounded-md font-bold">
                                                {item.tag}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="border-2 border-dashed border-surface-primary rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-bg-main transition-colors aspect-square group">
                                        <span className="text-surface-dark/40 text-xl group-hover:scale-125 transition-transform">📷</span>
                                        <span className="text-[8px] font-bold text-text-muted mt-1 uppercase">Додати</span>
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