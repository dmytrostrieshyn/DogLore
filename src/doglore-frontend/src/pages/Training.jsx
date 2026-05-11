import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './layout/Navbar';
// Виправляємо шлях до ВАШИХ сервісів
import { getSubcollectionData } from '../services/api/dbService'; 
// Зверни увагу: файл називається dbService.js (з великою S чи малою? Перевір у себе в папці)

export default function Training() {
    const [commands, setCommands] = useState([]);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);

    // Тимчасовий ID для тестів, поки не підключили авторизацію
    const dogId = "test_dog_id"; 

    useEffect(() => {
        const loadTrainingData = async () => {
            try {
                setLoading(true);
                // Використовуємо вашу функцію. 
                // Припустимо, шлях у БД: dogs/ID_СОБАКИ/training_logs
                const data = await getSubcollectionData(`dogs/${dogId}/training_logs`);
                setCommands(data || []);
            } catch (e) {
                console.error("Помилка при завантаженні тренувань:", e);
            } finally {
                setLoading(false);
            }
        };

        loadTrainingData();
    }, [dogId]);

    return (
        <div className="min-h-screen bg-bg-main">
            <Navbar />
            <div className="flex">
                <Sidebar />

                <main className="flex-1 p-8 md:p-12">
                    <div className="max-w-4xl">
                        <h1 className="text-3xl font-bold mb-2 font-montserrat text-text-primary">
                            Прогрес дресирування 🦴
                        </h1>
                        <p className="text-sm mb-10 text-text-secondary">
                            Дані завантажені через ваш dbservices
                        </p>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                
                                {/* Картка команд */}
                                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-surface-primary">
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="text-xl font-bold font-montserrat">Навички</h3>
                                        <span className="bg-brand-light-sage/30 text-brand-dark-olive text-[10px] font-black px-3 py-1 rounded-full uppercase">
                                            Live Data
                                        </span>
                                    </div>

                                    <div className="space-y-6">
                                        {loading ? (
                                            <div className="animate-pulse flex space-y-4 flex-col">
                                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        ) : commands.length > 0 ? (
                                            commands.map((cmd) => (
                                                <div key={cmd.id} className="space-y-2">
                                                    <div className="flex justify-between text-sm font-bold">
                                                        <span>{cmd.name || 'Команда'}</span>
                                                        <span className="text-brand-primary">{cmd.progress || 0}%</span>
                                                    </div>
                                                    <div className="h-2 bg-bg-warm rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-brand-primary transition-all duration-700"
                                                            style={{ width: `${cmd.progress || 0}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-text-secondary italic">Дані про команди відсутні в цій колекції</p>
                                        )}
                                    </div>
                                </div>

                                {/* Нотатки */}
                                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-surface-primary">
                                    <h3 className="text-xl font-bold mb-4 font-montserrat">Особливі зауваження</h3>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full bg-bg-warm rounded-2xl p-4 text-sm focus:outline-none border border-transparent focus:border-brand-light-sage min-h-[120px]"
                                        placeholder="Як пройшло сьогоднішнє заняття?"
                                    />
                                </div>
                            </div>

                            {/* Календар (статика для дизайну) */}
                            <div className="bg-brand-dark-olive text-white p-6 rounded-[32px] shadow-lg h-fit">
                                <h4 className="text-center font-bold mb-4 uppercase text-[10px] tracking-widest">Травень 2026</h4>
                                <div className="grid grid-cols-7 gap-2 text-center text-[10px]">
                                    <span className="opacity-50">S</span><span className="opacity-50">M</span>
                                    <span className="opacity-50">T</span><span className="opacity-50">W</span>
                                    <span className="opacity-50">T</span><span className="opacity-50">F</span>
                                    <span className="opacity-50">S</span>
                                    <div className="py-2 hover:bg-white/10 rounded-full cursor-pointer">10</div>
                                    <div className="py-2 bg-brand-accent rounded-full text-brand-dark-olive font-black shadow-md">11</div>
                                    <div className="py-2 hover:bg-white/10 rounded-full cursor-pointer">12</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}