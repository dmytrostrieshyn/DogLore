import { useEffect, useState } from 'react';
import Navbar from './layout/Navbar.jsx';
import DogCard from './components/DogCard';
// Імпортуємо універсальний метод з твого сервісу БД (згідно з гайдом)
// Зверни увагу на правильний шлях до dbService.js
import { getCollectionData } from '../services/dbService'; 

// Імпортуємо ваші SVG іконки
import encyclopediaIcon from '../assets/icons/encyclopedia.svg';
import pawIcon from '../assets/icons/paw.svg';

export default function Encyclopedia() {
    const [breeds, setBreeds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Згідно з гайдом, тягнемо всі документи з колекції 'breeds'
        getCollectionData('breeds')
            .then(data => {
                setBreeds(data || []);
            })
            .catch(err => console.error("Помилка завантаження порід:", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-bg-main">
            <Navbar />
            <main className="max-w-7xl mx-auto px-6 md:px-12 py-16">
                
                {/* Заголовок з іконкою */}
                <div className="text-center md:text-left mb-12">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                        <img src={encyclopediaIcon} alt="Енциклопедія" className="w-10 h-10" />
                        <h1 className="h1 text-4xl font-montserrat font-bold text-text-primary">Енциклопедія порід</h1>
                    </div>
                    <p className="body-standard max-w-2xl text-text-secondary text-lg">
                        Відкрийте для себе детальні профілі порід собак. Від темпераменту
                        до особливостей догляду — знайдіть ідеального компаньйона.
                    </p>
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
                                    id={breed.id}
                                    name={breed.name}
                                    image={breed.imageURL || breed.image_url}
                                    type={breed.type || breed.category || breed.group}
                                    size={breed.size}
                                    description={breed.description}
                                    temperament={breed.temperament}
                                />
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}