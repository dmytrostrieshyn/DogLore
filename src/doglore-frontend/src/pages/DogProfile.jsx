import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './layout/Navbar';
// Шлях до твого API
import { fetchDogFullProfile, fetchDogWeightHistory } from '../services/api/dogsApi';

export default function DogProfile() {
    const [dog, setDog] = useState(null);
    const [weightData, setWeightData] = useState([]);
    const [loading, setLoading] = useState(true);

    // УВАГА: Встав сюди РЕАЛЬНИЙ ID документа з твоєї бази Firebase (колекція dogs)
    // Наприклад: "z6kLp8W9jHq2..."
    const dogId = "odlQ8Y0niiv0wJ3JK2Kk"; 

    useEffect(() => {
        if (!dogId) return;

        const getFullData = async () => {
            try {
                setLoading(true);
                // 1. Тягнемо профіль + породу через твоє ядро
                const profile = await fetchDogFullProfile(dogId);
                // 2. Тягнемо історію ваги
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

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-bg-main">
            <p className="text-2xl font-bold animate-bounce">🐾 Твій собака біжить з бази даних...</p>
        </div>
    );

    if (!dog) return (
        <div className="text-center p-20">
            <h1 className="text-2xl red-500">Собаку не знайдено!</h1>
            <p>Перевір, чи вірний ID ти вставив у код і чи є така собака в колекції "dogs".</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-bg-main">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8 md:p-12">
                    {/* Головна картка */}
                    <div className="bg-white p-10 rounded-[40px] shadow-sm border border-surface-primary flex flex-col md:flex-row gap-10 items-center">
                        <img 
                            src={dog.image_url || "/buddy-large.jpg"} 
                            className="w-64 h-64 rounded-[32px] object-cover shadow-md" 
                            alt={dog.name} 
                        />
                        <div className="space-y-4">
                            <h1 className="text-5xl font-black font-montserrat text-text-primary">
                                {dog.name || "Без імені"}
                            </h1>
                            <div className="flex gap-4 text-lg">
                                <span className="bg-brand-light-sage/30 px-4 py-1 rounded-full text-brand-dark-olive font-bold">
                                    {dog.breedInfo?.name || "Порода не вказана"}
                                </span>
                                <span className="text-text-secondary font-medium">
                                    {dog.dogAge} роки • {dog.gender || "Стать"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Тут можна додати графік ваги з weightData */}
                </main>
            </div>
        </div>
    );
}