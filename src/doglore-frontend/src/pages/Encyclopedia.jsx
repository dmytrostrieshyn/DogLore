import { useEffect, useState } from 'react';
import Navbar from './layout/Navbar.jsx';
import DogCard from './components/DogCard';
import { fetchAllBreeds } from '../services/api/breedsApi';

// Імпортуємо ваші SVG іконки
import encyclopediaIcon from '../assets/icons/encyclopedia.svg';
import nextIcon from '../assets/icons/next.svg';
import pawIcon from '../assets/icons/paw.svg';

export default function Encyclopedia() {
    const [breeds, setBreeds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllBreeds()
            .then(data => {
                setBreeds(data || []);
                setLoading(false);
            })
            .catch(err => console.error("Помилка бази:", err));
    }, []);

    return (
        <div className="min-h-screen bg-bg-main">
            <Navbar />
            <main className="max-w-7xl mx-auto px-6 md:px-12 py-16">
                
                {/* Заголовок з іконкою */}
                <div className="text-center md:text-left mb-12">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                        <img src={encyclopediaIcon} alt="Енциклопедія" className="w-10 h-10" />
                        <h1 className="h1 text-4xl">Енциклопедія порід</h1>
                    </div>
                    <p className="body-standard max-w-2xl text-text-secondary text-lg">
                        Відкрийте для себе детальні профілі порід собак. Від темпераменту
                        до особливостей догляду — знайдіть ідеального компаньйона.
                    </p>
                </div>

                {/* Блок фільтрів та пошуку (візуал) */}
                <div className="flex flex-col md:flex-row gap-4 mb-12">
                    <div className="flex-1 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-lg">🔍</span>
                        <input
                            type="text"
                            placeholder="Пошук порід (напр. Золотистий ретривер)"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-surface-primary focus:outline-none focus:ring-2 ring-brand-light-sage/30 transition shadow-sm"
                        />
                    </div>
                    <select className="px-6 py-4 rounded-2xl bg-white border border-surface-primary font-bold text-text-secondary outline-none cursor-pointer">
                        <option>За розміром</option>
                        <option>Малі</option>
                        <option>Середні</option>
                        <option>Великі</option>
                    </select>
                    <select className="px-6 py-4 rounded-2xl bg-white border border-surface-primary font-bold text-text-secondary outline-none cursor-pointer">
                        <option>За призначенням</option>
                        <option>Мисливські</option>
                        <option>Пастуші</option>
                        <option>Робочі</option>
                    </select>
                </div>

                {/* Стан завантаження або сітка карток */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-6">
                        <img src={pawIcon} alt="Loading" className="w-12 h-12 animate-bounce opacity-40" />
                        <p className="text-xl font-bold font-montserrat text-text-secondary">Шукаємо найкращих друзів...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {breeds.map((breed) => (
                                <DogCard 
                                    key={breed.id} 
                                    name={breed.name} 
                                    image={breed.image_url} 
                                    {...breed} 
                                />
                            ))}
                        </div>

                        {/* Пагінація з SVG іконками next.svg */}
                        <div className="mt-20 flex justify-center items-center gap-6">
                            {/* Попередня сторінка (повертаємо іконку на 180 градусів) */}
                            <button className="w-12 h-12 flex items-center justify-center border border-surface-primary rounded-full hover:bg-white hover:shadow-md transition-all active:scale-95 bg-transparent">
                                <img src={nextIcon} alt="Попередня" className="w-4 h-4 rotate-180 opacity-60" />
                            </button>
                            
                            <span className="text-sm font-black text-text-primary uppercase tracking-widest">
                                Сторінка 1
                            </span>
                            
                            {/* Наступна сторінка */}
                            <button className="w-12 h-12 flex items-center justify-center border border-surface-primary rounded-full hover:bg-white hover:shadow-md transition-all active:scale-95 bg-transparent">
                                <img src={nextIcon} alt="Наступна" className="w-4 h-4 opacity-60" />
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}