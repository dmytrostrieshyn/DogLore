import { useEffect, useState } from 'react';
import Navbar from './layout/Navbar.jsx';
import DogCard from './components/DogCard';
import { fetchAllBreeds, searchBreeds } from '../services/api/breedsApi';

export default function Encyclopedia() {
    const [breeds, setBreeds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [sizeFilter, setSizeFilter] = useState('За розміром');

    // Завантаження всіх порід при старті
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const data = await fetchAllBreeds();
            setBreeds(data || []);
            setLoading(false);
        };
        loadData();
    }, []);

    // Логіка пошуку
    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (value.trim().length > 1) {
            const results = await searchBreeds(value);
            setBreeds(results);
        } else if (value.trim().length === 0) {
            const all = await fetchAllBreeds();
            setBreeds(all);
        }
    };

    // Фільтрація за розміром (клієнтська частина для швидкості)
    const filteredBreeds = breeds.filter(dog => {
        if (sizeFilter === 'За розміром') return true;
        return dog.size === sizeFilter;
    });

    return (
        <div className="min-h-screen bg-bg-main">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 md:px-12 py-16">
                {/* Заголовок */}
                <div className="text-center md:text-left mb-12">
                    <h1 className="text-4xl font-extrabold font-montserrat mb-4 text-text-primary tracking-tight">
                        Енциклопедія собак 📖
                    </h1>
                    <p className="text-text-secondary max-w-2xl text-lg">
                        Відкрийте для себе детальні профілі порід. Від темпераменту 
                        до особливостей догляду — знайдіть ідеального компаньйона.
                    </p>
                </div>

                {/* Фільтри та Пошук */}
                <div className="flex flex-col md:flex-row gap-4 mb-12">
                    <div className="flex-1 relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 transition-opacity">🔍</span>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Пошук порід (напр. Золотистий ретривер)"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-surface-primary shadow-sm focus:outline-none focus:ring-2 ring-brand-primary/20 transition-all"
                        />
                    </div>
                    
                    <select 
                        value={sizeFilter}
                        onChange={(e) => setSizeFilter(e.target.value)}
                        className="px-6 py-4 rounded-2xl bg-white border border-surface-primary font-bold text-text-secondary outline-none cursor-pointer hover:border-brand-primary transition-colors"
                    >
                        <option>За розміром</option>
                        <option>Малі</option>
                        <option>Середні</option>
                        <option>Великі</option>
                    </select>

                    <select className="px-6 py-4 rounded-2xl bg-white border border-surface-primary font-bold text-text-secondary outline-none opacity-50 cursor-not-allowed">
                        <option>За призначенням</option>
                    </select>
                </div>

                {/* Стан завантаження */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="font-bold text-brand-earth">Шукаємо найкращих друзів у базі...</p>
                    </div>
                ) : (
                    <>
                        {/* Сітка карток */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {filteredBreeds.length > 0 ? (
                                filteredBreeds.map((dog, index) => (
                                    <DogCard key={dog.id || index} {...dog} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-10">
                                    <p className="text-xl font-bold text-text-muted italic">На жаль, таку породу не знайдено 🐾</p>
                                </div>
                            )}
                        </div>

                        {/* Пагінація */}
                        <div className="mt-20 flex justify-center items-center gap-6">
                            <button className="w-12 h-12 flex items-center justify-center border border-surface-primary rounded-full hover:bg-white hover:shadow-md transition-all active:scale-95 disabled:opacity-30" disabled>←</button>
                            <span className="text-sm font-black text-text-primary uppercase tracking-widest">Сторінка 1</span>
                            <button className="w-12 h-12 flex items-center justify-center border border-surface-primary rounded-full hover:bg-white hover:shadow-md transition-all active:scale-95 disabled:opacity-30" disabled>→</button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}