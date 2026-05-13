import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from './layout/Navbar';
import { fetchBreedById } from '../services/api/breedsApi';
import pawIcon from '../assets/icons/paw.svg';

// ── Helpers ─────────────────────────────────────────────────────────────────

// Firestore may store temperament as a string ("Friendly, Loyal") or an array
const toArray = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return String(val).split(/[,;]+/).map(s => s.trim()).filter(Boolean);
};

// Render a stat chip used in the hero grid
function StatChip({ label, value }) {
    return (
        <div className="bg-[#F6F3F2] rounded-2xl p-4 flex flex-col gap-1 border border-[#EAE8E7]">
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#6B7280]">{label}</span>
            <span className="text-sm font-bold text-[#1B1C1C] font-montserrat">{value || '—'}</span>
        </div>
    );
}

// Render a section card — used for every info block below the hero
function InfoCard({ title, children, className = '' }) {
    return (
        <div className={`bg-white p-8 rounded-[32px] shadow-sm border border-[#EAE8E7] ${className}`}>
            <h2 className="text-xl font-montserrat font-bold text-[#1B1C1C] mb-5">{title}</h2>
            {children}
        </div>
    );
}

// ── Component ────────────────────────────────────────────────────────────────
export default function BreedDetails() {
    const { breedId } = useParams();
    const [breed, setBreed] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!breedId) return;
        setLoading(true);
        fetchBreedById(breedId)
            .then(data => {
                if (data) setBreed(data);
                else setError(true);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [breedId]);

    // ── States ───────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="min-h-screen bg-[#F6F3F2]">
            <Navbar />
            <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
                <img src={pawIcon} className="w-12 h-12 animate-bounce opacity-40" alt="" />
                <p className="text-xl font-bold font-montserrat text-[#424844]">Завантаження породи...</p>
            </div>
        </div>
    );

    if (error || !breed) return (
        <div className="min-h-screen bg-[#F6F3F2]">
            <Navbar />
            <div className="flex flex-col items-center justify-center h-[80vh] gap-6 text-center px-6">
                <img src={pawIcon} className="w-16 h-16 opacity-20" alt="" />
                <h1 className="text-2xl font-bold font-montserrat text-[#1A2B21]">Породу не знайдено</h1>
                <p className="text-[#6B7280] max-w-sm">Документ із таким ID не існує в базі даних.</p>
                <Link
                    to="/encyclopedia"
                    className="bg-[#1A2B21] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#2D4739] transition-all"
                >
                    ← Повернутися до енциклопедії
                </Link>
            </div>
        </div>
    );

    // ── Data helpers ─────────────────────────────────────────────────────────
    const image       = breed.imageURL || breed.image_url || '/buddy-large.jpg';
    const group       = breed.type     || breed.category  || breed.group || null;
    const temperament = toArray(breed.temperament);
    const gallery     = Array.isArray(breed.gallery) ? breed.gallery : [];

    // Care rows: try multiple possible field names from Firestore
    const careRows = [
        { label: 'Догляд за шерстю',  value: breed.grooming       || breed.groomingNeeds },
        { label: 'Фізична активність', value: breed.exercise       || breed.exerciseNeeds },
        { label: 'Навчання',           value: breed.trainability   || breed.training },
        { label: 'Харчування',         value: breed.feeding        || breed.diet },
        { label: 'Здоров\'я',          value: breed.health         || breed.healthIssues },
    ].filter(r => r.value);

    // Additional detail rows
    const detailRows = [
        { label: 'Розмір',     value: breed.size },
        { label: 'Вага',       value: breed.weight },
        { label: 'Зріст',      value: breed.height },
        { label: 'Тривалість', value: breed.lifespan || breed.life_expectancy },
        { label: 'Походження', value: breed.origin   || breed.country },
        { label: 'Шерсть',     value: breed.coat     || breed.coatType },
        { label: 'Окрас',      value: breed.colors   || breed.color },
    ].filter(r => r.value);

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#F6F3F2]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-8">

                {/* Back link */}
                <Link
                    to="/encyclopedia"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#424844] hover:text-[#1A2B21] transition-colors group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    Енциклопедія порід
                </Link>

                {/* ── Hero card ── */}
                <div className="bg-white rounded-[40px] shadow-sm border border-[#EAE8E7] p-8 md:p-12 flex flex-col md:flex-row gap-10 items-start">

                    {/* Image */}
                    <div className="w-full md:w-[380px] shrink-0">
                        <div className="aspect-[4/3] rounded-[32px] overflow-hidden shadow-lg ring-8 ring-[#F6F3F2]">
                            <img
                                src={image}
                                alt={breed.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-6">
                        {group && (
                            <span className="inline-block bg-[#F2C9B3] text-[#4A3B32] text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                                {group}
                            </span>
                        )}

                        <div>
                            <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-[#1A2B21] leading-tight uppercase tracking-tight">
                                {breed.name}
                            </h1>
                            {breed.origin && (
                                <p className="text-[#6B7280] font-inter text-sm mt-2 flex items-center gap-2">
                                    <span>🌍</span> {breed.origin}
                                </p>
                            )}
                        </div>

                        {/* Quick stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <StatChip label="Розмір"      value={breed.size} />
                            <StatChip label="Тривалість"  value={breed.lifespan || breed.life_expectancy} />
                            <StatChip label="Група"       value={group} />
                            <StatChip label="Вага"        value={breed.weight} />
                        </div>

                        {/* Temperament tags — shown in hero if present */}
                        {temperament.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {temperament.map(trait => (
                                    <span
                                        key={trait}
                                        className="bg-[#1A2B21] text-white text-[11px] font-bold px-3 py-1.5 rounded-full"
                                    >
                                        {trait}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Bottom grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left column */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* Details */}
                        {detailRows.length > 0 && (
                            <InfoCard title="Характеристики">
                                <div className="space-y-3">
                                    {detailRows.map(({ label, value }, i) => (
                                        <div
                                            key={label}
                                            className={`flex justify-between items-start py-2 gap-4 ${i < detailRows.length - 1 ? 'border-b border-[#EAE8E7]' : ''}`}
                                        >
                                            <span className="text-[10px] font-bold uppercase tracking-wide text-[#6B7280] shrink-0">{label}</span>
                                            <span className="text-sm font-bold text-[#1B1C1C] text-right">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </InfoCard>
                        )}

                        {/* Temperament card (standalone, if not shown in hero) */}
                        {temperament.length > 0 && (
                            <InfoCard title="Темперамент">
                                <div className="flex flex-wrap gap-2">
                                    {temperament.map(trait => (
                                        <span
                                            key={trait}
                                            className="bg-[#F2C9B3]/60 text-[#4A3B32] text-[11px] font-bold px-3 py-1.5 rounded-full border border-[#F2C9B3]"
                                        >
                                            {trait}
                                        </span>
                                    ))}
                                </div>
                            </InfoCard>
                        )}

                        {/* CTA card */}
                        <div className="bg-[#1A2B21] p-8 rounded-[32px] text-white relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-white/60 text-[10px] uppercase font-bold mb-2 tracking-wide">Хочете цю породу?</p>
                                <h3 className="text-xl font-bold mb-5 font-montserrat leading-snug">
                                    Зареєструйте свого {breed.name} у DogLore
                                </h3>
                                <Link
                                    to="/auth"
                                    className="block w-full bg-white text-[#1A2B21] py-3 rounded-xl font-bold text-center text-sm hover:bg-[#F6F3F2] transition-colors"
                                >
                                    Створити профіль
                                </Link>
                            </div>
                            <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Description */}
                        {breed.description && (
                            <InfoCard title="Опис породи">
                                <p className="text-[#424844] font-inter text-[15px] leading-relaxed">
                                    {breed.description}
                                </p>
                            </InfoCard>
                        )}

                        {/* Care requirements */}
                        {careRows.length > 0 && (
                            <InfoCard title="Вимоги до догляду">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {careRows.map(({ label, value }) => (
                                        <div
                                            key={label}
                                            className="bg-[#F6F3F2] rounded-2xl p-5 border border-[#EAE8E7]"
                                        >
                                            <p className="text-[10px] font-bold uppercase tracking-wide text-[#6B7280] mb-2">{label}</p>
                                            <p className="text-sm font-bold text-[#1B1C1C]">{value}</p>
                                        </div>
                                    ))}
                                </div>
                            </InfoCard>
                        )}

                        {/* Extra description fields */}
                        {(breed.history || breed.background) && (
                            <InfoCard title="Історія породи">
                                <p className="text-[#424844] font-inter text-[15px] leading-relaxed">
                                    {breed.history || breed.background}
                                </p>
                            </InfoCard>
                        )}

                        {/* Gallery */}
                        {gallery.length > 0 && (
                            <InfoCard title="Галерея">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {gallery.map((url, i) => (
                                        <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-[#EAE8E7] group">
                                            {url
                                                ? <img src={url} alt={`${breed.name} ${i + 1}`} className="w-full h-full object-cover transition transform group-hover:scale-110 duration-500" />
                                                : <div className="w-full h-full bg-[#F6F3F2]" />
                                            }
                                        </div>
                                    ))}
                                </div>
                            </InfoCard>
                        )}
                    </div>
                </div>
            </main>

            <footer className="py-10 text-center text-[#6B7280] text-sm border-t border-[#EAE8E7] mt-12">
                © 2026 DogLore. Всі права захищені.
            </footer>
        </div>
    );
}
