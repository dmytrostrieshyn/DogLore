import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './layout/Navbar';
import {
    fetchDogFullProfile,
    fetchDogWeightHistory,
    fetchDogGallery,
    updateDogProfile,
    addWeightEntry,
    addGalleryPhoto,
    fetchJournalEntries,
    addJournalEntry,
} from '../services/api/dogsApi';
import { useAuth } from '../context/AuthContext';

import pawIcon from '../assets/icons/paw.svg';
import likeIcon from '../assets/icons/like.svg';
import sizeIcon from '../assets/icons/size.svg';
import addPhotoIcon from '../assets/icons/add_photo.svg';

const INPUT = "border border-[#EAE8E7] bg-[#F6F3F2] rounded-xl px-3 py-2 font-inter text-sm text-[#1B1C1C] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1A2B21] w-full";
const INPUT_SM = "border border-[#EAE8E7] bg-white rounded-lg px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#1A2B21]";
const EMPTY = 'Не вказано';
const CHART_PX = 160;

function UrlModal({ title, label, placeholder, value, onChange, onSave, onClose, saving, preview }) {
    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-bold font-montserrat text-[#1A2B21] mb-6">{title}</h3>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase text-text-muted">{label}</label>
                    <input
                        type="url"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        placeholder={placeholder}
                        className={INPUT}
                        autoFocus
                    />
                </div>

                {/* Preview */}
                {preview && value && (
                    <div className="mt-4 rounded-2xl overflow-hidden border border-[#EAE8E7] h-40">
                        <img
                            src={value}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={e => { e.target.style.display = 'none'; }}
                        />
                    </div>
                )}

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onSave}
                        disabled={saving || !value}
                        className="flex-1 bg-[#1A2B21] text-white py-3 rounded-xl font-bold hover:bg-[#2D4739] transition-all disabled:opacity-50"
                    >
                        {saving ? 'Збереження...' : 'Зберегти'}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl font-bold bg-[#F6F3F2] text-text-secondary hover:bg-[#EAE8E7] transition-all"
                    >
                        Скасувати
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function DogProfile() {
    const { dogId } = useAuth();
    const [dog, setDog] = useState(null);
    const [weightData, setWeightData] = useState([]);
    const [galleryData, setGalleryData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Edit mode
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);

    // Weight form
    const [showWeightForm, setShowWeightForm] = useState(false);
    const [weightInput, setWeightInput] = useState('');
    const [weightLabel, setWeightLabel] = useState('');
    const [savingWeight, setSavingWeight] = useState(false);

    // Vaccination modal
    const [showVaccinationModal, setShowVaccinationModal] = useState(false);
    const [vaccinationDate, setVaccinationDate] = useState('');
    const [vaccinationType, setVaccinationType] = useState('');
    const [savingVaccination, setSavingVaccination] = useState(false);

    // Avatar URL modal
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [savingAvatar, setSavingAvatar] = useState(false);

    // Gallery URL modal
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [galleryUrl, setGalleryUrl] = useState('');
    const [savingGallery, setSavingGallery] = useState(false);

    // Journal
    const [journalEntries, setJournalEntries] = useState([]);
    const [journalImageUrl, setJournalImageUrl] = useState('');
    const [journalDescription, setJournalDescription] = useState('');
    const [savingJournal, setSavingJournal] = useState(false);
    const journalRef = useRef(null);
    const location = useLocation();

    // ── Fetch ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!dogId) { setLoading(false); return; }
        const load = async () => {
            try {
                setLoading(true);
                const [profile, history, gallery, journal] = await Promise.all([
                    fetchDogFullProfile(dogId),
                    fetchDogWeightHistory(dogId),
                    fetchDogGallery(dogId),
                    fetchJournalEntries(dogId),
                ]);
                setDog(profile);
                setWeightData(history || []);
                setGalleryData(gallery || []);
                setJournalEntries(journal || []);
            } catch (err) {
                console.error('Помилка завантаження:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [dogId]);

    useEffect(() => {
        if (!dog) return;
        setForm({
            name:          dog.name          || '',
            dogAge:        dog.dogAge        ?? '',
            gender:        dog.gender        || '',
            breedName:     dog.breedInfo?.name || dog.breedName || '',
            color:         dog.color         || '',
            height:        dog.height        || '',
            activityLevel: dog.activityLevel || '',
            chipNumber:    dog.chipNumber    || '',
            foodType:      dog.foodType      || '',
        });
    }, [dog]);

    const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!dogId) return;
        setSaving(true);
        try {
            const updates = {
                name:          form.name,
                dogAge:        Number(form.dogAge) || 0,
                gender:        form.gender,
                breedName:     form.breedName,
                color:         form.color,
                height:        form.height,
                activityLevel: form.activityLevel,
                chipNumber:    form.chipNumber,
                foodType:      form.foodType,
            };
            await updateDogProfile(dogId, updates);
            setDog(prev => ({ ...prev, ...updates }));
            setIsEditing(false);
        } catch (err) {
            console.error('Помилка збереження:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (dog) setForm({
            name:          dog.name          || '',
            dogAge:        dog.dogAge        ?? '',
            gender:        dog.gender        || '',
            breedName:     dog.breedInfo?.name || dog.breedName || '',
            color:         dog.color         || '',
            height:        dog.height        || '',
            activityLevel: dog.activityLevel || '',
            chipNumber:    dog.chipNumber    || '',
            foodType:      dog.foodType      || '',
        });
        setIsEditing(false);
    };

    const handleAddWeight = async () => {
        if (!weightInput || !dogId) return;
        setSavingWeight(true);
        try {
            const label = weightLabel.trim() || new Date().toLocaleDateString('uk-UA', { month: 'short' });
            await addWeightEntry(dogId, weightInput, label);
            const updated = await fetchDogWeightHistory(dogId);
            setWeightData(updated || []);
            setWeightInput('');
            setWeightLabel('');
            setShowWeightForm(false);
        } catch (err) {
            console.error('Помилка додавання ваги:', err);
        } finally {
            setSavingWeight(false);
        }
    };

    const handleSaveVaccination = async () => {
        if (!vaccinationDate || !dogId) return;
        setSavingVaccination(true);
        try {
            const vax = { date: vaccinationDate, type: vaccinationType || 'Планове' };
            await updateDogProfile(dogId, { nextVaccination: vax });
            setDog(prev => ({ ...prev, nextVaccination: vax }));
            setShowVaccinationModal(false);
            setVaccinationDate('');
            setVaccinationType('');
        } catch (err) {
            console.error('Помилка збереження щеплення:', err);
        } finally {
            setSavingVaccination(false);
        }
    };

    const handleSaveAvatar = async () => {
        if (!avatarUrl || !dogId) return;
        setSavingAvatar(true);
        try {
            await updateDogProfile(dogId, { image_url: avatarUrl });
            setDog(prev => ({ ...prev, image_url: avatarUrl }));
            setShowAvatarModal(false);
            setAvatarUrl('');
        } catch (err) {
            console.error('Помилка збереження фото:', err);
        } finally {
            setSavingAvatar(false);
        }
    };

    const handleSaveGalleryPhoto = async () => {
        if (!galleryUrl || !dogId) return;
        setSavingGallery(true);
        try {
            await addGalleryPhoto(dogId, galleryUrl);
            setGalleryData(prev => [...prev, { imageURL: galleryUrl, ageLabel: '' }]);
            setShowGalleryModal(false);
            setGalleryUrl('');
        } catch (err) {
            console.error('Помилка додавання фото:', err);
        } finally {
            setSavingGallery(false);
        }
    };

    const handleSaveJournalEntry = async () => {
        if (!journalDescription.trim() || !dogId) return;
        setSavingJournal(true);
        try {
            await addJournalEntry(dogId, journalImageUrl, journalDescription.trim());
            setJournalEntries(prev => [...prev, { imageURL: journalImageUrl, description: journalDescription.trim() }]);
            setJournalImageUrl('');
            setJournalDescription('');
        } catch (err) {
            console.error('Помилка збереження запису:', err);
        } finally {
            setSavingJournal(false);
        }
    };

    // Scroll to journal when navigated from sidebar
    useEffect(() => {
        if (location.state?.scrollTo === 'journal' && journalRef.current) {
            setTimeout(() => journalRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400);
        }
    }, [location.state]);

    const formatDate = (d) => {
        if (!d) return 'Не вказано';
        if (typeof d.toDate === 'function') return d.toDate().toLocaleDateString('uk-UA');
        if (d.seconds) return new Date(d.seconds * 1000).toLocaleDateString('uk-UA');
        return String(d);
    };

    // ── Guards ────────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="flex h-screen flex-col items-center justify-center bg-bg-main gap-4">
            <img src={pawIcon} alt="Loading" className="w-12 h-12 animate-bounce opacity-50" />
            <p className="text-2xl font-bold font-montserrat text-text-primary">Завантаження профілю...</p>
        </div>
    );

    if (!dog) return (
        <div className="min-h-screen bg-bg-main">
            <Navbar />
            <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center px-6">
                <img src={pawIcon} alt="" className="w-16 h-16 opacity-20" />
                <h1 className="text-2xl font-bold font-montserrat text-[#1A2B21]">Профіль собаки ще не налаштовано</h1>
                <p className="text-text-secondary max-w-sm">
                    {dogId
                        ? 'Не вдалося знайти дані. Перевірте підключення та спробуйте ще раз.'
                        : 'Зареєструйте свого собаку, щоб побачити профіль.'}
                </p>
            </div>
        </div>
    );

    const displayBreed = dog.breedInfo?.name || dog.breedName || EMPTY;

    const chartData = weightData.length > 0 && weightData.some(e => e.value)
        ? weightData.slice(-7)
        : [
            { label: 'Січ', value: 18 }, { label: 'Лют', value: 21 },
            { label: 'Бер', value: 25 }, { label: 'Квіт', value: 28 },
            { label: 'Трав', value: 30 }, { label: 'Черв', value: 31.5 },
            { label: 'Лип', value: 32.4 },
        ];
    const maxWeight = Math.max(...chartData.map(d => d.value), 1);

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-bg-main">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8 md:p-12 space-y-8">

                    {/* ── Hero card ── */}
                    <div className="relative bg-white p-10 rounded-[40px] shadow-sm border border-surface-primary flex flex-col md:flex-row gap-10 items-center">

                        <div className="absolute top-6 right-6 flex gap-2">
                            {isEditing ? (
                                <>
                                    <button onClick={handleSave} disabled={saving}
                                        className="bg-[#1A2B21] text-white px-4 py-1.5 rounded-full text-[11px] font-bold hover:bg-[#2D4739] transition-all disabled:opacity-60">
                                        {saving ? 'Збереження...' : 'Зберегти'}
                                    </button>
                                    <button onClick={handleCancel}
                                        className="bg-[#EAE8E7] text-[#424844] px-4 py-1.5 rounded-full text-[11px] font-bold hover:bg-[#d8d5d3] transition-all">
                                        Скасувати
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="bg-[#F2C9B3] text-[#4A3B32] px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
                                        Активний та здоровий
                                    </div>
                                    <button onClick={() => setIsEditing(true)}
                                        className="bg-[#F6F3F2] text-[#424844] px-4 py-1.5 rounded-full text-[11px] font-bold hover:bg-[#EAE8E7] transition-all border border-[#EAE8E7]">
                                        ✎ Редагувати
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Avatar — click to open URL modal */}
                        <div className="relative shrink-0 group cursor-pointer" onClick={() => setShowAvatarModal(true)}>
                            <img
                                src={dog.image_url || '/buddy-large.jpg'}
                                className="w-64 h-64 rounded-[32px] object-cover shadow-xl ring-8 ring-bg-main"
                                alt={dog.name || 'Собака'}
                            />
                            <div className="absolute inset-0 rounded-[32px] bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <img src={addPhotoIcon} alt="" className="w-8 h-8 invert mb-1" />
                                <span className="text-white text-[11px] font-bold">Змінити фото</span>
                            </div>
                        </div>

                        <div className="flex-1 w-full text-center md:text-left space-y-6">
                            {isEditing ? (
                                <div className="space-y-3">
                                    <input value={form.name} onChange={e => set('name', e.target.value)}
                                        placeholder="Кличка" className={INPUT + ' text-xl font-bold font-montserrat'} />
                                    <div className="flex gap-3 flex-wrap">
                                        <input value={form.breedName} onChange={e => set('breedName', e.target.value)}
                                            placeholder="Порода" className={INPUT + ' flex-1'} />
                                        <input type="number" value={form.dogAge} onChange={e => set('dogAge', e.target.value)}
                                            placeholder="Вік" min="0" className={INPUT + ' w-24'} />
                                        <select value={form.gender} onChange={e => set('gender', e.target.value)}
                                            className={INPUT + ' w-36'}>
                                            <option value="">Стать</option>
                                            <option value="Хлопець">Хлопець</option>
                                            <option value="Дівчинка">Дівчинка</option>
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h1 className="text-5xl font-black font-montserrat text-text-primary mb-2 uppercase tracking-tight">
                                        {dog.name || 'Без імені'}
                                    </h1>
                                    <div className="flex gap-4 items-center justify-center md:justify-start text-lg mt-4">
                                        <span className="bg-[#EAECE9] px-4 py-1 rounded-full text-[#4A3B32] font-bold">{displayBreed}</span>
                                        <span className="text-text-secondary font-medium">
                                            {dog.dogAge ? `${dog.dogAge} р.` : 'Вік не вказано'} • {dog.gender || 'Стать не вказана'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                                <div className="bg-bg-main p-4 rounded-2xl border border-surface-primary/50 text-center flex flex-col items-center justify-center">
                                    <p className="text-[10px] text-text-muted uppercase mb-1 font-bold">Вага</p>
                                    <p className="font-bold font-montserrat text-lg">
                                        {chartData[chartData.length - 1]?.value ?? '—'} кг
                                    </p>
                                </div>
                                <div className="bg-bg-main p-4 rounded-2xl border border-surface-primary/50 text-center flex flex-col items-center justify-center">
                                    <p className="text-[10px] text-text-muted uppercase mb-1 font-bold">Зріст</p>
                                    {isEditing ? (
                                        <input type="number" value={form.height} onChange={e => set('height', e.target.value)}
                                            placeholder="см" className={INPUT_SM + ' w-20'} />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <img src={sizeIcon} alt="" className="w-5 h-5 opacity-70" />
                                            <p className="font-bold font-montserrat text-lg">{dog.height ? `${dog.height} см` : '—'}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-bg-main p-4 rounded-2xl border border-surface-primary/50 text-center flex flex-col items-center justify-center">
                                    <p className="text-[10px] text-text-muted uppercase mb-1 font-bold">Активність</p>
                                    {isEditing ? (
                                        <select value={form.activityLevel} onChange={e => set('activityLevel', e.target.value)}
                                            className={INPUT_SM + ' w-full'}>
                                            <option value="">Оберіть</option>
                                            <option value="Низька">Низька</option>
                                            <option value="Середня">Середня</option>
                                            <option value="Висока">Висока</option>
                                        </select>
                                    ) : (
                                        <p className="font-bold font-montserrat text-lg">{dog.activityLevel || '—'}</p>
                                    )}
                                </div>
                                <div className="bg-bg-main p-4 rounded-2xl border border-surface-primary/50 text-center flex flex-col items-center justify-center">
                                    <p className="text-[10px] text-text-muted uppercase mb-1 font-bold">Здоров'я</p>
                                    <img src={likeIcon} alt="Health" className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Bottom grid ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-text-primary">

                        {/* Left column */}
                        <div className="lg:col-span-4 space-y-8">

                            {/* Details card */}
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-surface-primary">
                                <h3 className="text-xl font-bold mb-6 font-montserrat">Деталі</h3>
                                <div className="space-y-4 text-sm">
                                    {[
                                        { label: 'Колір',      field: 'color',      placeholder: 'Наприклад: золотий' },
                                        { label: 'Чіп',        field: 'chipNumber', placeholder: 'Номер чіпу' },
                                        { label: 'Харчування', field: 'foodType',   placeholder: 'Наприклад: сухий корм' },
                                    ].map(({ label, field, placeholder }, i, arr) => (
                                        <div key={field}
                                            className={`flex justify-between items-center py-2 gap-4 ${i < arr.length - 1 ? 'border-b border-surface-primary/30' : ''}`}>
                                            <span className="text-text-muted font-bold uppercase text-[10px] shrink-0">{label}</span>
                                            {isEditing ? (
                                                <input value={form[field]} onChange={e => set(field, e.target.value)}
                                                    placeholder={placeholder}
                                                    className="border border-[#EAE8E7] bg-[#F6F3F2] rounded-lg px-2 py-1 text-xs text-right w-full focus:outline-none focus:ring-1 focus:ring-[#1A2B21]" />
                                            ) : (
                                                <span className={`font-bold ${!dog[field] ? 'text-text-muted italic text-xs' : ''}`}>
                                                    {dog[field] || EMPTY}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Vaccination card */}
                            <div className="bg-[#1A2B21] p-8 rounded-[32px] text-white shadow-lg relative overflow-hidden group">
                                <div className="relative z-10">
                                    <p className="text-white/60 text-[10px] uppercase font-bold mb-2">Наступне щеплення</p>
                                    <h4 className="text-xl font-bold mb-1 font-montserrat">
                                        {dog.nextVaccination?.date ? formatDate(dog.nextVaccination.date) : 'Не призначено'}
                                    </h4>
                                    {dog.nextVaccination?.type && (
                                        <p className="text-white/60 text-sm mb-5">{dog.nextVaccination.type}</p>
                                    )}
                                    {!dog.nextVaccination?.type && <div className="mb-5" />}
                                    <button
                                        onClick={() => setShowVaccinationModal(true)}
                                        className="w-full bg-white text-[#1A2B21] py-3 rounded-xl font-bold hover:bg-bg-main transition-colors"
                                    >
                                        {dog.nextVaccination?.date ? 'Змінити нагадування' : 'Додати нагадування'}
                                    </button>
                                </div>
                                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />
                            </div>
                        </div>

                        {/* Right column */}
                        <div className="lg:col-span-8 space-y-8">

                            {/* Growth chart */}
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-surface-primary">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold font-montserrat tracking-tight">Щоденник росту</h3>
                                    <div className="flex gap-2 items-center">
                                        <span className="bg-[#1A2B21] text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-md">Вага</span>
                                        <button
                                            onClick={() => setShowWeightForm(v => !v)}
                                            className="w-7 h-7 rounded-full bg-[#F6F3F2] border border-[#EAE8E7] flex items-center justify-center text-[#1A2B21] font-bold text-lg hover:bg-[#EAE8E7] transition-all"
                                        >+</button>
                                    </div>
                                </div>

                                {showWeightForm && (
                                    <div className="flex gap-3 mb-6 p-4 bg-[#F6F3F2] rounded-2xl border border-[#EAE8E7] items-end">
                                        <div className="flex flex-col gap-1 flex-1">
                                            <label className="text-[10px] font-bold uppercase text-text-muted">Вага (кг)</label>
                                            <input type="number" step="0.1" min="0" value={weightInput}
                                                onChange={e => setWeightInput(e.target.value)} placeholder="32.4" className={INPUT} />
                                        </div>
                                        <div className="flex flex-col gap-1 flex-1">
                                            <label className="text-[10px] font-bold uppercase text-text-muted">Мітка</label>
                                            <input type="text" value={weightLabel}
                                                onChange={e => setWeightLabel(e.target.value)} placeholder="Лип" className={INPUT} />
                                        </div>
                                        <button onClick={handleAddWeight} disabled={savingWeight || !weightInput}
                                            className="bg-[#1A2B21] text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-[#2D4739] transition-all disabled:opacity-50">
                                            {savingWeight ? '...' : 'Зберегти'}
                                        </button>
                                        <button onClick={() => setShowWeightForm(false)}
                                            className="px-3 py-2 rounded-xl text-sm text-text-muted hover:bg-[#EAE8E7] transition-all">✕</button>
                                    </div>
                                )}

                                <div className="flex items-end gap-2 px-2" style={{ height: `${CHART_PX}px` }}>
                                    {chartData.map((entry, i) => {
                                        const barH = Math.max(Math.round((entry.value / maxWeight) * CHART_PX), 4);
                                        return (
                                            <div key={i} className="flex flex-col items-center flex-1 gap-2 group h-full justify-end">
                                                <div
                                                    className="w-full bg-[#1A2B21] rounded-t-xl hover:opacity-80 transition-all relative cursor-pointer"
                                                    style={{ height: `${barH}px` }}
                                                >
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                        {entry.value} кг
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-text-muted font-bold capitalize shrink-0">{entry.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Gallery */}
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-surface-primary">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold font-montserrat text-text-primary">Галерея</h3>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {galleryData.map((item, i) => (
                                        <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden shadow-sm border border-bg-main">
                                            {item.imageURL
                                                ? <img src={item.imageURL} className="w-full h-full object-cover transition transform group-hover:scale-110 duration-500" alt="Gallery" />
                                                : <div className="w-full h-full bg-[#F6F3F2]" />
                                            }
                                            {item.ageLabel && (
                                                <span className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md text-white text-[8px] px-2 py-1 rounded-md font-bold">
                                                    {item.ageLabel}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                    <div
                                        onClick={() => setShowGalleryModal(true)}
                                        className="border-2 border-dashed border-surface-primary rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-bg-main transition-colors aspect-square group"
                                    >
                                        <img src={addPhotoIcon} alt="Додати фото" className="w-8 h-8 opacity-40 group-hover:scale-110 group-hover:opacity-60 transition-all" />
                                        <span className="text-[10px] text-text-muted font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Додати URL</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ── Journal section ── */}
                    <div ref={journalRef} id="journal-section" className="scroll-mt-8">
                        <div className="bg-white rounded-[32px] shadow-sm border border-surface-primary overflow-hidden">
                            <div className="px-8 py-5 border-b border-[#EAE8E7] bg-[#F6F3F2] flex items-center justify-between">
                                <h3 className="font-montserrat font-bold text-[15px] uppercase tracking-widest text-[#1A2B21]">Щоденник</h3>
                                <span className="text-[11px] font-bold text-[#6B7280]">{journalEntries.length} записів</span>
                            </div>

                            {/* Existing entries */}
                            {journalEntries.length > 0 && (
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-[#EAE8E7]">
                                    {journalEntries.map((entry, i) => (
                                        <div key={i} className="flex gap-4 p-4 bg-[#F6F3F2] rounded-2xl border border-[#EAE8E7]">
                                            {entry.imageURL && (
                                                <img
                                                    src={entry.imageURL}
                                                    alt=""
                                                    className="w-24 h-24 rounded-xl object-cover shrink-0"
                                                    onError={e => { e.target.style.display = 'none'; }}
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-inter text-[#424844] leading-relaxed">{entry.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add new entry form */}
                            <div className="p-8 space-y-4">
                                <h4 className="font-montserrat font-bold text-[13px] text-[#1A2B21] uppercase tracking-wide">Новий запис</h4>
                                <input
                                    type="text"
                                    value={journalImageUrl}
                                    onChange={e => setJournalImageUrl(e.target.value)}
                                    placeholder="URL фото (необов'язково)"
                                    className="border border-[#EAE8E7] bg-[#F6F3F2] rounded-xl px-4 py-3 font-inter text-sm text-[#1B1C1C] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1A2B21] w-full"
                                />
                                <textarea
                                    value={journalDescription}
                                    onChange={e => setJournalDescription(e.target.value)}
                                    placeholder={`Що сьогодні вивчив ${dog?.name || 'пес'}? Опишіть тренування, спостереження...`}
                                    rows={4}
                                    className="border border-[#EAE8E7] bg-[#F6F3F2] rounded-xl px-4 py-3 font-inter text-sm text-[#1B1C1C] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1A2B21] w-full resize-none"
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleSaveJournalEntry}
                                        disabled={savingJournal || !journalDescription.trim()}
                                        className="bg-[#1A2B21] text-white px-8 py-3 rounded-xl font-montserrat font-bold text-sm hover:bg-[#2D4739] transition-all shadow-md disabled:opacity-50"
                                    >
                                        {savingJournal ? 'Збереження...' : '+ Зберегти запис'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </main>
            </div>

            {/* ── Avatar URL modal ── */}
            {showAvatarModal && (
                <UrlModal
                    title="Фото профілю"
                    label="URL зображення"
                    placeholder="https://example.com/dog.jpg"
                    value={avatarUrl}
                    onChange={setAvatarUrl}
                    onSave={handleSaveAvatar}
                    onClose={() => { setShowAvatarModal(false); setAvatarUrl(''); }}
                    saving={savingAvatar}
                    preview
                />
            )}

            {/* ── Gallery URL modal ── */}
            {showGalleryModal && (
                <UrlModal
                    title="Додати фото до галереї"
                    label="URL зображення"
                    placeholder="https://example.com/photo.jpg"
                    value={galleryUrl}
                    onChange={setGalleryUrl}
                    onSave={handleSaveGalleryPhoto}
                    onClose={() => { setShowGalleryModal(false); setGalleryUrl(''); }}
                    saving={savingGallery}
                    preview
                />
            )}

            {/* ── Vaccination modal ── */}
            {showVaccinationModal && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={e => e.target === e.currentTarget && setShowVaccinationModal(false)}
                >
                    <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold font-montserrat text-[#1A2B21] mb-6">Нагадування про щеплення</h3>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase text-text-muted">Дата щеплення</label>
                                <input type="date" value={vaccinationDate} onChange={e => setVaccinationDate(e.target.value)} className={INPUT} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase text-text-muted">Тип щеплення</label>
                                <input type="text" value={vaccinationType} onChange={e => setVaccinationType(e.target.value)}
                                    placeholder="Наприклад: від сказу" className={INPUT} />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={handleSaveVaccination} disabled={savingVaccination || !vaccinationDate}
                                className="flex-1 bg-[#1A2B21] text-white py-3 rounded-xl font-bold hover:bg-[#2D4739] transition-all disabled:opacity-50">
                                {savingVaccination ? 'Збереження...' : 'Зберегти'}
                            </button>
                            <button onClick={() => setShowVaccinationModal(false)}
                                className="px-6 py-3 rounded-xl font-bold bg-[#F6F3F2] text-text-secondary hover:bg-[#EAE8E7] transition-all">
                                Скасувати
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
