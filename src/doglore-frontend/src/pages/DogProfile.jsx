import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './layout/Navbar';
import { fetchDogFullProfile, fetchDogWeightHistory } from '../services/api/dogsApi';

// Імпортуємо іконки з папки assets
import pawIcon from '../assets/icons/paw.svg';
import likeIcon from '../assets/icons/like.svg';
import sizeIcon from '../assets/icons/size.svg';
import addPhotoIcon from '../assets/icons/add_photo.svg';

export default function DogProfile() {
    const [dog, setDog] = useState(null);
    const [weightData, setWeightData] = useState([]);
    const [loading, setLoading] = useState(true);

    const dogId = "odlQ8Y0niiv0wJ3JK2Kk"; 

    useEffect(() => {
        if (!dogId) return;

        const getFullData = async () => {
            try {
                setLoading(true);
                const profile = await fetchDogFullProfile(dogId);
                const history = await fetchDogWeightHistory(dogId);

                setDog(profile);
                setWeightData(history || []);
            } catch (err) {
                console.error("Глобальна помилка завантаження:", err);
            } finally {
                setLoading(false);
            }
        };

        getFullData();
    }, [dogId]);

    // Анімований екран завантаження з вашою іконкою лапки
    if (loading) return (
        <div className="flex h-screen flex-col items-center justify-center bg-bg-main gap-4">
            <img src={pawIcon} alt="Loading" className="w-12 h-12 animate-bounce opacity-50" />
            <p className="text-2xl font-bold font-montserrat text-text-primary">Твій собака біжить з бази даних...</p>
        </div>
    );

    if (!dog) return (
        <div className="text-center p-20">
            <h1 className="text-2xl text-red-500 font-bold">Собаку не знайдено!</h1>
            <p className="mt-2 text-text-secondary">Перевір, чи є така собака в колекції "dogs".</p>
        </div>
    );

    // Заглушка для графіка росту, якщо база поки порожня або немає поля value
    const displayWeightData = weightData.length > 0 && weightData[0].value 
        ? weightData.slice(-7) 
        : [
            { label: 'Січ', value: 18 },
            { label: 'Лют', value: 21 },
            { label: 'Бер', value: 25 },
            { label: 'Квіт', value: 28 },
            { label: 'Трав', value: 30 },
            { label: 'Черв', value: 31.5 },
            { label: 'Лип', value: 32.4 }
        ];

    return (
        <div className="min-h-screen bg-bg-main">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8 md:p-12 space-y-8">
                    
                    {/* БЛОК 1: Головна картка (додано relative для бейджа) */}
                    <div className="relative bg-white p-10 rounded-[40px] shadow-sm border border-surface-primary flex flex-col md:flex-row gap-10 items-center">
                        
                        {/* Персиковий бейдж "Активний та здоровий" у правому верхньому куті */}
                        <div className="absolute top-6 right-6 bg-[#F2C9B3] text-[#4A3B32] px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
                            Активний та здоровий
                        </div>

                        <img 
                            src={dog.image_url || "/buddy-large.jpg"} 
                            className="w-64 h-64 rounded-[32px] object-cover shadow-xl ring-8 ring-bg-main" 
                            alt={dog.name} 
                        />
                        
                        <div className="flex-1 w-full text-center md:text-left space-y-6">
                            <div>
                                <h1 className="text-5xl font-black font-montserrat text-text-primary mb-2 uppercase tracking-tight">
                                    {dog.name || "Без імені"}
                                </h1>
                                <div className="flex gap-4 items-center justify-center md:justify-start text-lg mt-4">
                                    <span className="bg-[#EAECE9] px-4 py-1 rounded-full text-[#4A3B32] font-bold">
                                        {dog.breedInfo?.name || "Порода не вказана"}
                                    </span>
                                    <span className="text-text-secondary font-medium">
                                        {dog.dogAge} роки • {dog.gender || "Стать"}
                                    </span>
                                </div>
                            </div>

                            {/* Швидка статистика з SVG іконками */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                                <div className="bg-bg-main p-4 rounded-2xl border border-surface-primary/50 text-center flex flex-col items-center justify-center">
                                    <p className="text-[10px] text-text-muted uppercase mb-1 font-bold">Вага</p>
                                    <p className="font-bold font-montserrat text-lg">{displayWeightData[displayWeightData.length - 1]?.value} кг</p>
                                </div>
                                <div className="bg-bg-main p-4 rounded-2xl border border-surface-primary/50 text-center flex flex-col items-center justify-center">
                                    <p className="text-[10px] text-text-muted uppercase mb-1 font-bold">Зріст</p>
                                    <div className="flex items-center gap-2">
                                        <img src={sizeIcon} alt="Size" className="w-5 h-5 opacity-70" />
                                        <p className="font-bold font-montserrat text-lg">{dog.height || '58'} см</p>
                                    </div>
                                </div>
                                <div className="bg-bg-main p-4 rounded-2xl border border-surface-primary/50 text-center flex flex-col items-center justify-center">
                                    <p className="text-[10px] text-text-muted uppercase mb-1 font-bold">Активність</p>
                                    <p className="font-bold font-montserrat text-lg">{dog.activityLevel || 'Висока'}</p>
                                </div>
                                <div className="bg-bg-main p-4 rounded-2xl border border-surface-primary/50 text-center flex flex-col items-center justify-center">
                                    <p className="text-[10px] text-text-muted uppercase mb-1 font-bold">Здоров'я</p>
                                    <img src={likeIcon} alt="Health" className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* БЛОК 2: Нижня сітка (Деталі, Графік, Галерея) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-text-primary">
                        
                        {/* Ліва колонка */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-surface-primary">
                                <h3 className="text-xl font-bold mb-6 font-montserrat">Деталі</h3>
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between py-2 border-b border-surface-primary/30">
                                        <span className="text-text-muted font-bold uppercase text-[10px]">Колір</span>
                                        <span className="font-bold">{dog.color || 'Не вказано'}</span>
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

                            <div className="bg-[#1A2B21] p-8 rounded-[32px] text-white shadow-lg relative overflow-hidden group">
                                <div className="relative z-10">
                                    <p className="text-white/60 text-[10px] uppercase font-bold mb-2">Наступне щеплення</p>
                                    <h4 className="text-xl font-bold mb-6 font-montserrat">{dog.nextVaccination || '24 Березня, 2024 (Сказ)'}</h4>
                                    <button className="w-full bg-white text-[#1A2B21] py-3 rounded-xl font-bold hover:bg-bg-main transition-colors">
                                        Нагадати мені
                                    </button>
                                </div>
                                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all"></div>
                            </div>
                        </div>

                        {/* Права колонка */}
                        <div className="lg:col-span-8 space-y-8">
                            
                            {/* Щоденник росту з темними стовпчиками */}
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-surface-primary">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-bold font-montserrat tracking-tight">Щоденник росту</h3>
                                    <div className="flex gap-2 text-[10px] font-bold">
                                        <span className="bg-[#1A2B21] text-white px-3 py-1 rounded-full shadow-md">Вага</span>
                                        <span className="bg-bg-main px-3 py-1 rounded-full text-text-muted opacity-50">Зріст</span>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between h-48 gap-4 px-4 mt-8">
                                    {displayWeightData.map((entry, i) => (
                                        <div key={i} className="flex flex-col items-center flex-1 gap-3 group">
                                            <div 
                                                className="w-full bg-[#1A2B21] rounded-t-xl transition-all hover:opacity-80 relative cursor-pointer" 
                                                style={{ height: `${(entry.value / 40) * 100}%` }}
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    {entry.value} кг
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-text-muted font-bold capitalize">
                                                {entry.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Галерея з іконкою add_photo.svg */}
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-surface-primary">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold font-montserrat text-text-primary">Галерея</h3>
                                    <button className="text-text-primary text-sm font-bold hover:underline flex items-center gap-1">
                                        Всі фото <span>➔</span>
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {(dog.gallery || [
                                        { img: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eca3?auto=format&fit=crop&q=80&w=200', tag: '2 місяці' },
                                        { img: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=200', tag: '1 рік' },
                                        { img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=200', tag: '2 роки' },
                                    ]).map((item, i) => (
                                        <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden shadow-sm border border-bg-main">
                                            <img src={item.img} className="w-full h-full object-cover transition transform group-hover:scale-110 duration-500" alt="Gallery" />
                                            <span className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md text-white text-[8px] px-2 py-1 rounded-md font-bold">
                                                {item.tag}
                                            </span>
                                        </div>
                                    ))}
                                    
                                    {/* Кнопка додавання фото */}
                                    <div className="border-2 border-dashed border-surface-primary rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-bg-main transition-colors aspect-square group">
                                        <img src={addPhotoIcon} alt="Додати фото" className="w-8 h-8 opacity-40 group-hover:scale-110 group-hover:opacity-60 transition-all" />
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