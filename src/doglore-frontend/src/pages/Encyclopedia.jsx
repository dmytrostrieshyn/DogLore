import { useEffect, useState } from 'react';
import Navbar from './layout/Navbar.jsx';
import DogCard from './components/DogCard';
import { fetchAllBreeds } from '../services/api/breedsApi';

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
            <main className="max-w-7xl mx-auto px-6 py-16">
                <h1 className="h1 text-4xl mb-10">Енциклопедія порід</h1>
                {loading ? (
                    <p className="text-center py-20 font-bold">Завантаження порід...</p>
                ) : (
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
                )}
            </main>
        </div>
    );
}