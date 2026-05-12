import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './layout/Navbar';
import { fetchDogFullProfile, fetchDogWeightHistory, fetchDogGallery, updateDogProfile } from '../services/api/dogsApi';
import { useAuth } from '../context/AuthContext';

import pawIcon from '../assets/icons/paw.svg';
import likeIcon from '../assets/icons/like.svg';
import sizeIcon from '../assets/icons/size.svg';
import addPhotoIcon from '../assets/icons/add_photo.svg';

const INPUT = "border border-[#EAE8E7] bg-[#F6F3F2] rounded-xl px-3 py-2 font-inter text-sm text-[#1B1C1C] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1A2B21] w-full";
const INPUT_SM = "border border-[#EAE8E7] bg-white rounded-lg px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#1A2B21]";

const EMPTY = 'Не вказано';

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

    // ── Fetch dog data ────────────────────────────────────────────────────────
    useEffect(() => {
        if (!dogId) {
            setLoading(false); // Don't spin forever when no dogId
            return;
        }
        const load = async () => {
            try {
                setLoading(true);
                const [profile, history, gallery] = await Promise.all([
                    fetchDogFullProfile(dogId),
                    fetchDogWeightHistory(dogId),
                    fetchDogGallery(dogId),
                ]);
                setDog(profile);
                setWeightData(history || []);
                setGalleryData(gallery || []);
            } catch (err) {
                console.error('Помилка завантаження:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [dogId]);

    // Sync edit form whenever dog data changes
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
        // Reset form to current saved values
        if (dog) {
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
        }
        setIsEditing(false);
    };

    // ── Helpers ───────────────────────────────────────────────────────────────
    const formatDate = (d) => {
        if (!d) return '';
        if (typeof d.toDate === 'function') return d.toDate().toLocaleDateString('uk-UA');
        return String(d);
    };

    // ── Loading / empty guards ────────────────────────────────────────────────
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

    const displayWeightData = weightData.length > 0 && weightData[0]?.value
        ? weightData.slice(-7)
        : [
            { label: 'Січ', value: 18 }, { label: 'Лют', value: 21 },
            { label: 'Бер', value: 25 }, { label: 'Квіт', value: 28 },
            { label: 'Трав', value: 30 }, { label: 'Черв', value: 31.5 },
            { label: 'Лип', value: 32.4 },
        ];

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-bg-main">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8 md:p-12 space-y-8">

                    {/* ── Hero card ── */}
                    <div className="relative bg-white p-10 rounded-[40px] shadow-sm border border-surface-primary flex flex-col md:flex-row gap-10 items-center">

                        {/* Top-right controls */}
                        <div className="absolute top-6 right-6 flex gap-2">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="bg-[#1A2B21] text-white px-4 py-1.5 rounded-full text-[11px] font-bold hover:bg-[#2D4739] transition-all disabled:opacity-60"
                                    >
                                        {saving ? 'Збереження...' : 'Зберегти'}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="bg-[#EAE8E7] text-[#424844] px-4 py-1.5 rounded-full text-[11px] font-bold hover:bg-[#d8d5d3] transition-all"
                                    >
                                        Скасувати
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="bg-[#F2C9B3] text-[#4A3B32] px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
                                        Активний та здоровий
                                    </div>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-[#F6F3F2] text-[#424844] px-4 py-1.5 rounded-full text-[11px] font-bold hover:bg-[#EAE8E7] transition-all border border-[#EAE8E7]"
                                    >
                                        ✎ Редагувати
                                    </button>
                                </>
                            )}
                        </div>

                        <img
                            src={dog.image_url || '/buddy-large.jpg'}
                            className="w-64 h-64 rounded-[32px] object-cover shadow-xl ring-8 ring-bg-main"
                            alt={dog.name || 'Собака'}
                        />

                        <div className="flex-1 w-full text-center md:text-left space-y-6">
                            {isEditing ? (
                                <div className="space-y-3">
                                    <input
                                        value={form.name}
                                        onChange={e => set('name', e.target.value)}
                                        placeholder="Кличка"
                                        className={INPUT + ' text-xl font-bold font-montserrat'}
                                    />
                                    <div className="flex gap-3 flex-wrap">
                                        <input
                                            value={form.breedName}
                                            onChange={e => set('breedName', e.target.value)}
                                            placeholder="Порода"
                                            className={INPUT + ' flex-1'}
                                        />
                                        <input
                                            type="number"
                                            value={form.dogAge}
                                            onChange={e => set('dogAge', e.target.value)}
                                            placeholder="Вік"
                                            min="0"
                                            className={INPUT + ' w-24'}
                                        />
                                        <select
                                            value={form.gender}
                                            onChange={e => set('gender', e.target.value)}
                                            className={INPUT + ' w-36'}
                                        >
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
                                        <span className="bg-[#EAECE9] px-4 py-1 rounded-full text-[#4A3B32] font-bold">
                                            {displayBreed}
                                        </span>
                                        <span className="text-text-secondary font-medium">
                                            {dog.dogAge ? `${dog.dogAge} р.` : 'Вік не вказано'} • {dog.gender || 'Стать не вказана'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Stats grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                                <div className="bg-bg-main p-4 rounded-2xl border border-surface-primary/50 text-center flex flex-col items-center justify-center">
                                    <p className="text-[10px] text-text-muted uppercase mb-1 font-bold">Вага</p>
                                    <p className="font-bold font-montserrat text-lg">
                                        {displayWeightData[displayWeightData.length - 1]?.value ?? '—'} кг
                                    </p>
                                </div>
                                <div className="bg-bg-main p-4 rounded-2xl border border-surface-primary/50 text-center flex flex-col items-center justify-center">
                                    <p className="text-[10px] text-text-muted uppercase mb-1 font-bold">Зріст</p>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={form.height}
                                            onChange={e => set('height', e.target.value)}
                                            placeholder="см"
                                            className={INPUT_SM + ' w-20'}
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <img src={sizeIcon} alt="" className="w-5 h-5 opacity-70" />
                                            <p className="font-bold font-montserrat text-lg">
                                                {dog.height ? `${dog.height} см` : '—'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-bg-main p-4 rounded-2xl border border-surface-primary/50 text-center flex flex-col items-center justify-center">
                                    <p className="text-[10px] text-text-muted uppercase mb-1 font-bold">Активність</p>
                                    {isEditing ? (
                                        <select
                                            value={form.activityLevel}
                                            onChange={e => set('activityLevel', e.target.value)}
                                            className={INPUT_SM + ' w-full'}
                                        >
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
                                        <div
                                            key={field}
                                            className={`flex justify-between items-center py-2 gap-4 ${i < arr.length - 1 ? 'border-b border-surface-primary/30' : ''}`}
                                        >
                                            <span className="text-text-muted font-bold uppercase text-[10px] shrink-0">{label}</span>
                                            {isEditing ? (
                                                <input
                                                    value={form[field]}
                                                    onChange={e => set(field, e.target.value)}
                                                    placeholder={placeholder}
                                                    className="border border-[#EAE8E7] bg-[#F6F3F2] rounded-lg px-2 py-1 text-xs text-right w-full focus:outline-none focus:ring-1 focus:ring-[#1A2B21]"
                                                />
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
                                    <h4 className="text-xl font-bold mb-6 font-montserrat">
                                        {dog.nextVaccination
                                            ? `${formatDate(dog.nextVaccination.date)} (${dog.nextVaccination.type || 'Планове'})`
                                            : 'Дані відсутні'}
                                    </h4>
                                    <button className="w-full bg-white text-[#1A2B21] py-3 rounded-xl font-bold hover:bg-bg-main transition-colors">
                                        Нагадати мені
                                    </button>
                                </div>
                                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />
                            </div>
                        </div>

                        {/* Right column */}
                        <div className="lg:col-span-8 space-y-8">

                            {/* Growth chart */}
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
                                            <span className="text-[10px] text-text-muted font-bold capitalize">{entry.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Gallery */}
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-surface-primary">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold font-montserrat text-text-primary">Галерея</h3>
                                    <button className="text-text-primary text-sm font-bold hover:underline flex items-center gap-1">
                                        Всі фото <span>➔</span>
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {(galleryData.length > 0 ? galleryData : [
                                        { imageURL: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eca3?auto=format&fit=crop&q=80&w=200', ageLabel: '2 місяці' },
                                        { imageURL: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=200', ageLabel: '1 рік' },
                                        { imageURL: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=200', ageLabel: '2 роки' },
                                    ]).map((item, i) => (
                                        <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden shadow-sm border border-bg-main">
                                            {item.imageURL
                                                ? <img src={item.imageURL} className="w-full h-full object-cover transition transform group-hover:scale-110 duration-500" alt="Gallery" />
                                                : <div className="w-full h-full bg-[#F6F3F2]" />
                                            }
                                            <span className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md text-white text-[8px] px-2 py-1 rounded-md font-bold">
                                                {item.ageLabel}
                                            </span>
                                        </div>
                                    ))}
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
