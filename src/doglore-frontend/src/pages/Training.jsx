import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './layout/Navbar';
import { fetchTrainingLogs, updateTrainingNotes, toggleTrainingDate } from '../services/api/trainingApi';
import { fetchDogFullProfile, addNewCommand, updateCommandProgress } from '../services/api/dogsApi';
import { useAuth } from '../context/AuthContext';
import addCommandIcon from '../assets/icons/add_command.svg';

const MONTHS_UK = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
const INPUT = "border border-[#EAE8E7] bg-[#F6F3F2] rounded-xl px-3 py-2 font-inter text-sm text-[#1B1C1C] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1A2B21] w-full";

function generateCalendar(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
}

function dateStr(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function Training() {
    const { dogId } = useAuth();
    const [dog, setDog] = useState(null);
    const [commands, setCommands] = useState([]);
    const [notes, setNotes] = useState('');
    const [completedDates, setCompletedDates] = useState([]);
    // FIXED: Ініціалізуємо loading значенням true, якщо у нас є dogId
    const [loading, setLoading] = useState(!!dogId);
    const [saving, setSaving] = useState(false);
    const [notesSaved, setNotesSaved] = useState(false);

    const now = new Date();
    const [calYear] = useState(now.getFullYear());
    const [calMonth] = useState(now.getMonth());

    const [showAddCommand, setShowAddCommand] = useState(false);
    const [newCommandName, setNewCommandName] = useState('');
    const [savingCommand, setSavingCommand] = useState(false);

    // ── FIXED: Fetch Logic ──────────────────────────────────────────────────
    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            // Якщо dogId немає, просто ставимо loading у false асинхронно
            if (!dogId) {
                if (isMounted) setLoading(false);
                return;
            }

            try {
                // setLoading(true) викликається вже всередині асинхронного потоку
                if (isMounted) setLoading(true);

                const [logsData, profileData] = await Promise.all([
                    fetchTrainingLogs(dogId),
                    fetchDogFullProfile(dogId),
                ]);

                if (isMounted) {
                    setCommands(logsData || []);
                    if (profileData) {
                        setDog(profileData);
                        setNotes(profileData.trainingNotes || '');
                        setCompletedDates(profileData.completedTrainingDates || []);
                    }
                }
            } catch (err) {
                console.error('Помилка завантаження трекінгу:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, [dogId]);

    // Решта логіки обробників залишається такою ж, але з поправками на чистоту
    const handleSaveNotes = async () => {
        setSaving(true);
        try {
            await updateTrainingNotes(dogId, notes);
            const todayStr = new Date().toISOString().split('T')[0];
            if (!completedDates.includes(todayStr)) {
                setCompletedDates(prev => [...prev, todayStr]);
            }
            setNotesSaved(true);
            setTimeout(() => setNotesSaved(false), 2000);
        } catch (e) {
            console.error('Помилка збереження нотаток:', e);
        } finally {
            setSaving(false);
        }
    };

    const handleToggleDate = async (day) => {
        const ds = dateStr(calYear, calMonth, day);
        const was = completedDates.includes(ds);
        setCompletedDates(prev => was ? prev.filter(d => d !== ds) : [...prev, ds]);
        try {
            await toggleTrainingDate(dogId, ds, was);
        } catch (err) {
            console.error('Помилка перемикання дати:', err);
            setCompletedDates(prev => was ? [...prev, ds] : prev.filter(d => d !== ds));
        }
    };

    const handleProgressChange = async (cmd, delta) => {
        const newVal = Math.min(100, Math.max(0, (Number(cmd.progress) || 0) + delta));
        setCommands(prev => prev.map(c => c.id === cmd.id ? { ...c, progress: newVal } : c));
        try {
            await updateCommandProgress(dogId, cmd.id, newVal);
        } catch (err) {
            console.error('Помилка оновлення прогресу:', err);
        }
    };

    const handleAddCommand = async () => {
        if (!newCommandName.trim() || !dogId) return;
        setSavingCommand(true);
        try {
            const id = await addNewCommand(dogId, newCommandName.trim());
            setCommands(prev => [...prev, { id, name: newCommandName.trim(), progress: 0 }]);
            setNewCommandName('');
            setShowAddCommand(false);
        } catch (err) {
            console.error('Помилка додавання команди:', err);
        } finally {
            setSavingCommand(false);
        }
    };

    const calCells = generateCalendar(calYear, calMonth);
    const todayStr = now.toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-bg-main">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8 md:p-12">
                    <h1 className="text-4xl mb-2 font-montserrat font-bold text-[#1A2B21]">Прогрес дресирування</h1>
                    <p className="text-sm mb-10 text-text-muted">
                        Відстеження розвитку {dog?.name || '...'} та нових навичок за допомогою лагідного виховання.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Commands card */}
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-surface-primary">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-2xl font-bold font-montserrat">Активні команди</h3>
                                    <span className="bg-[#F2C9B3]/40 text-[#D9774E] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase">
                                        {commands.length} в процесі
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    {loading ? (
                                        <p className="text-text-muted animate-pulse">Завантаження команд...</p>
                                    ) : commands.length > 0 ? (
                                        commands.map((cmd, i) => {
                                            const progressVal = Number(cmd.progress) || 0;
                                            const isMastered = progressVal >= 100;
                                            return (
                                                <div key={cmd.id || i} className="space-y-2">
                                                    <div className="flex justify-between items-center text-sm font-bold">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-5 h-5 rounded-[6px] flex items-center justify-center border-2 transition-colors ${isMastered ? 'bg-[#1A2B21] border-[#1A2B21]' : 'bg-transparent border-gray-300'}`}>
                                                                {isMastered && (
                                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <span className={`text-base ${isMastered ? 'line-through text-text-muted' : 'text-[#1A2B21]'}`}>{cmd.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleProgressChange(cmd, -10)}
                                                                disabled={progressVal <= 0}
                                                                className="w-6 h-6 rounded-full bg-[#F6F3F2] border border-[#EAE8E7] text-[#1A2B21] font-bold text-sm flex items-center justify-center hover:bg-[#EAE8E7] disabled:opacity-30 transition-all"
                                                            >−</button>
                                                            <span className="text-xs text-text-muted w-10 text-center">{progressVal}%</span>
                                                            <button
                                                                onClick={() => handleProgressChange(cmd, 10)}
                                                                disabled={progressVal >= 100}
                                                                className="w-6 h-6 rounded-full bg-[#F6F3F2] border border-[#EAE8E7] text-[#1A2B21] font-bold text-sm flex items-center justify-center hover:bg-[#EAE8E7] disabled:opacity-30 transition-all"
                                                            >+</button>
                                                        </div>
                                                    </div>
                                                    <div className="h-2.5 bg-[#F9ECE4] rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-[#1A2B21] transition-all duration-500 rounded-full"
                                                            style={{ width: `${progressVal}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-text-muted italic">Ще немає активних команд. Додайте першу!</p>
                                    )}
                                </div>

                                {showAddCommand && (
                                    <div className="mt-6 flex gap-3 items-center p-4 bg-[#F6F3F2] rounded-2xl border border-[#EAE8E7]">
                                        <input
                                            autoFocus
                                            value={newCommandName}
                                            onChange={e => setNewCommandName(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleAddCommand()}
                                            placeholder="Наприклад: Дай лапу"
                                            className={INPUT}
                                        />
                                        <button
                                            onClick={handleAddCommand}
                                            disabled={savingCommand || !newCommandName.trim()}
                                            className="bg-[#1A2B21] text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-[#2D4739] transition-all disabled:opacity-50 shrink-0"
                                        >
                                            {savingCommand ? '...' : 'Додати'}
                                        </button>
                                        <button onClick={() => { setShowAddCommand(false); setNewCommandName(''); }}
                                            className="px-3 py-2 text-text-muted hover:bg-[#EAE8E7] rounded-xl transition-all shrink-0">✕</button>
                                    </div>
                                )}
                            </div>

                            {/* Notes */}
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-surface-primary">
                                <h3 className="text-2xl font-bold mb-6 font-montserrat">Примітки до тренувань</h3>
                                <textarea
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    className="w-full bg-[#F8F9FA] rounded-[24px] p-6 text-sm focus:outline-none border border-transparent focus:border-[#EAE8E7] min-h-[160px] resize-none text-text-primary"
                                    placeholder={`Сьогодні ${dog?.name || 'пес'} добре реагує на ласощі...`}
                                />
                                <div className="flex justify-end items-center gap-4 mt-4">
                                    {notesSaved && <span className="text-sm text-[#1A2B21] font-bold">✓ Збережено</span>}
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

                        {/* Right — calendar */}
                        <div className="space-y-6">
                            <div className="bg-[#1A2B21] text-white p-8 rounded-[32px] shadow-lg">
                                <h4 className="font-bold mb-6 font-montserrat text-sm flex justify-between">
                                    <span>{MONTHS_UK[calMonth]} {calYear}</span>
                                    <span className="text-[#F2C9B3] text-[10px] uppercase">Днів: {completedDates.filter(d => d.startsWith(`${calYear}-${String(calMonth + 1).padStart(2, '0')}`)).length}</span>
                                </h4>
                                <div className="grid grid-cols-7 gap-y-3 text-[10px] text-center font-bold">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                        <span key={i} className="text-white/50 mb-1">{d}</span>
                                    ))}
                                    {calCells.map((day, i) => {
                                        if (!day) return <div key={i} />;
                                        const ds = dateStr(calYear, calMonth, day);
                                        const isCompleted = completedDates.includes(ds);
                                        const isToday = ds === todayStr;
                                        return (
                                            <div
                                                key={i}
                                                onClick={() => handleToggleDate(day)}
                                                className={`w-7 h-7 mx-auto flex items-center justify-center rounded-full cursor-pointer transition-all hover:scale-110 text-[11px]
                                                    ${isCompleted ? 'bg-[#F2C9B3] text-[#1A2B21] font-bold' : isToday ? 'border-2 border-white' : 'font-medium hover:bg-white/10'}`}
                                            >
                                                {day}
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="text-white/40 text-[9px] text-center mt-4 uppercase tracking-wider">Натисніть на день щоб відмітити тренування</p>
                            </div>

                            <div
                                onClick={() => setShowAddCommand(true)}
                                className="border border-dashed border-gray-300 bg-[#F8F9FA] rounded-[32px] p-8 text-center flex flex-col items-center justify-center gap-4 hover:bg-white transition-colors cursor-pointer group"
                            >
                                <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-gray-100">
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