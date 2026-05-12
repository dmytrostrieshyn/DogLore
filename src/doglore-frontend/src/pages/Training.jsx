import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './layout/Navbar';
import { fetchTrainingLogs, updateTrainingNotes } from '../services/api/trainingApi';

// Імпортуємо SVG-іконку для кнопки додавання команди
import addCommandIcon from '../assets/icons/add_command.svg';

export default function Training() {
    const [commands, setCommands] = useState([]);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Використовуємо реальний ID твоєї собаки
    const dogId = "odlQ8Y0niiv0wJ3JK2Kk";

    useEffect(() => {
        if (!dogId) return;
        
        setLoading(true);
        fetchTrainingLogs(dogId)
            .then(data => {
                setCommands(data || []);
            })
            .catch(err => console.error("Помилка завантаження команд:", err))
            .finally(() => setLoading(false));
    }, [dogId]);

    const handleSaveNotes = async () => {
        setSaving(true);
        try {
            await updateTrainingNotes(dogId, notes);
            alert('Примітки успішно збережено!');
        } catch (e) {
            console.error(e);
            alert('Помилка при збереженні приміток');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-main">
            <Navbar />
            <div className="flex">
                <Sidebar />

                <main className="flex-1 p-8 md:p-12">
                    <h1 className="text-4xl mb-2 font-montserrat font-bold text-[#1A2B21]">Прогрес дресирування</h1>
                    <p className="text-sm mb-10 text-text-muted">Відстеження розвитку Бадді та нових навичок за допомогою лагідного виховання.</p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Ліва частина: Команди та Примітки */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* Картка команд */}
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-surface-primary">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-2xl font-bold font-montserrat">Активні команди</h3>
                                    <span className="bg-[#F2C9B3]/40 text-[#D9774E] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase">
                                        3 Goals This Week
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    {loading ? (
                                        <p className="text-text-muted animate-pulse">Завантаження команд...</p>
                                    ) : commands.length > 0 ? (
                                        commands.map((cmd, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex justify-between items-center text-sm font-bold">
                                                    <div className="flex items-center gap-4">
                                                        {/* Кастомний чекбокс як у Фігмі */}
                                                        <div className={`w-5 h-5 rounded-[6px] flex items-center justify-center transition-colors border-2 ${cmd.progress === 100 ? 'bg-[#1A2B21] border-[#1A2B21]' : 'bg-transparent border-gray-300'}`}>
                                                            {cmd.progress === 100 && (
                                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <span className="text-base text-[#1A2B21]">{cmd.name}</span>
                                                    </div>
                                                    <span className="text-text-muted text-xs">{cmd.progress}% Mastery</span>
                                                </div>
                                                {/* Смуга прогресу */}
                                                <div className="h-2.5 bg-[#F9ECE4] rounded-full overflow-hidden mt-2">
                                                    <div 
                                                        className="h-full bg-[#F2C9B3] transition-all duration-700 rounded-full" 
                                                        style={{ width: `${cmd.progress}%` }} 
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-text-muted italic">Ще немає активних команд. Додайте першу!</p>
                                    )}
                                </div>
                            </div>

                            {/* Примітки */}
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-surface-primary">
                                <h3 className="text-2xl font-bold mb-6 font-montserrat">Примітки до тренувань</h3>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full bg-[#F8F9FA] rounded-[24px] p-6 text-sm focus:outline-none border border-transparent focus:border-[#F2C9B3] min-h-[160px] resize-none text-text-primary"
                                    placeholder="Сьогодні Бадді добре реагує на смачні ласощі..."
                                />
                                <div className="flex justify-end mt-4">
                                    <button 
                                        onClick={handleSaveNotes}
                                        disabled={saving}
                                        className="bg-[#1A2B21] text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 disabled:opacity-50 transition-all shadow-md"
                                    >
                                        {saving ? 'Збереження...' : 'Зберегти'}
                                    </button>
                                </div>
                            </div>

                        </div>

                        {/* Права частина: Календар та Додавання команд */}
                        <div className="space-y-6">
                            
                            {/* Календар під дизайн Фігми */}
                            <div className="bg-[#1A2B21] text-white p-8 rounded-[32px] shadow-lg">
                                <h4 className="font-bold mb-6 font-montserrat text-sm">Жовтень 2026</h4>
                                <div className="grid grid-cols-7 gap-y-4 text-[10px] text-center font-bold items-center">
                                    {/* Дні тижня */}
                                    <span className="text-white/50 mb-2">S</span>
                                    <span className="text-white/50 mb-2">M</span>
                                    <span className="text-white/50 mb-2">T</span>
                                    <span className="text-white/50 mb-2">W</span>
                                    <span className="text-white/50 mb-2">T</span>
                                    <span className="text-white/50 mb-2">F</span>
                                    <span className="text-white/50 mb-2">S</span>
                                    
                                    {/* Дати (Візуал) */}
                                    <div className="text-white/30 font-medium">29</div>
                                    <div className="text-white/30 font-medium">30</div>
                                    <div className="font-medium">1</div>
                                    {/* Виділена дата (персикова) */}
                                    <div className="w-7 h-7 mx-auto flex items-center justify-center bg-[#F2C9B3] text-[#1A2B21] rounded-full cursor-pointer hover:scale-110 transition-transform">2</div>
                                    <div className="font-medium">3</div>
                                    <div className="font-medium">4</div>
                                    <div className="font-medium">5</div>
                                    
                                    <div className="font-medium">6</div>
                                    {/* Виділена дата (персикова) */}
                                    <div className="w-7 h-7 mx-auto flex items-center justify-center bg-[#F2C9B3] text-[#1A2B21] rounded-full cursor-pointer hover:scale-110 transition-transform">7</div>
                                    <div className="font-medium">8</div>
                                    <div className="font-medium">9</div>
                                    <div className="font-medium">10</div>
                                    <div className="font-medium">11</div>
                                    <div className="font-medium">12</div>
                                    
                                    <div className="font-medium">13</div>
                                    <div className="font-medium">14</div>
                                    {/* Виділена дата (персикова) */}
                                    <div className="w-7 h-7 mx-auto flex items-center justify-center bg-[#F2C9B3] text-[#1A2B21] rounded-full cursor-pointer hover:scale-110 transition-transform">15</div>
                                    {/* Поточна дата (обідок) */}
                                    <div className="w-7 h-7 mx-auto flex items-center justify-center border-2 border-white rounded-full cursor-pointer">16</div>
                                    <div className="font-medium">17</div>
                                    <div className="font-medium">18</div>
                                    <div className="font-medium">19</div>
                                </div>
                            </div>

                            {/* Картка Нова ціль */}
                            <div className="relative overflow-hidden rounded-[32px] aspect-[4/3] group cursor-pointer shadow-sm">
                                <img 
                                    src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=500" 
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                    alt="Goal" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#6B3A23]/90 via-[#6B3A23]/50 to-transparent p-8 flex flex-col justify-end text-white">
                                    <h4 className="font-bold text-2xl leading-tight mb-2 font-montserrat">Нова ціль: Без повідця</h4>
                                    <p className="text-sm opacity-90 mb-4">Вам залишилося всього 4 заняття до початку тренувань без повідця в саду.</p>
                                    <span className="text-sm font-light">Дізнатися більше</span>
                                </div>
                            </div>

                            {/* Кнопка "Додати команду" із SVG */}
                            <div className="border border-dashed border-gray-300 bg-[#F8F9FA] rounded-[32px] p-8 text-center flex flex-col items-center justify-center gap-4 hover:bg-white transition-colors cursor-pointer group">
                                <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-gray-100">
                                    {/* Ваша іконка додавання */}
                                    <img src={addCommandIcon} alt="Додати" className="w-4 h-4 opacity-80" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#1A2B21]">Тренувати нову команду</p>
                                    <p className="text-xs text-text-muted mt-1">Поруч, Дай лапу або Перевернись</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}