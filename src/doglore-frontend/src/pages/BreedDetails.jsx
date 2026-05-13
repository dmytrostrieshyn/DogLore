import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from './layout/Navbar';
import { fetchBreedById } from '../services/api/breedsApi';
import pawIcon from '../assets/icons/paw.svg';

// ── Reusable card shell ───────────────────────────────────────────────────────
function Block({ title, accent, children }) {
    return (
        <div className="bg-white rounded-[32px] shadow-sm border border-[#EAE8E7] overflow-hidden">
            {/* Coloured header strip */}
            <div className={`px-8 py-5 border-b border-[#EAE8E7] ${accent}`}>
                <h2 className="font-montserrat font-bold text-[15px] uppercase tracking-widest text-inherit">
                    {title}
                </h2>
            </div>
            <div className="p-8">{children}</div>
        </div>
    );
}

// ── Stat pill used inside hero ────────────────────────────────────────────────
function Pill({ label, value }) {
    if (!value) return null;
    return (
        <div className="flex flex-col gap-0.5 bg-[#F6F3F2] border border-[#EAE8E7] rounded-2xl px-5 py-3">
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#6B7280]">{label}</span>
            <span className="text-sm font-montserrat font-bold text-[#1B1C1C]">{value}</span>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BreedDetails() {
    const { breedId } = useParams();
    const [breed, setBreed] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!breedId) return;
        setLoading(true);
        setError(false);
        fetchBreedById(breedId)
            .then(data => { if (data) setBreed(data); else setError(true); })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [breedId]);

    // ── States ───────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="min-h-screen bg-[#F6F3F2]">
            <Navbar />
            <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
                <img src={pawIcon} className="w-12 h-12 animate-bounce opacity-40" alt="" />
                <p className="text-xl font-bold font-montserrat text-[#424844]">Завантаження...</p>
            </div>
        </div>
    );

    if (error || !breed) return (
        <div className="min-h-screen bg-[#F6F3F2]">
            <Navbar />
            <div className="flex flex-col items-center justify-center h-[80vh] gap-6 text-center px-6">
                <img src={pawIcon} className="w-16 h-16 opacity-20" alt="" />
                <h1 className="text-2xl font-bold font-montserrat text-[#1A2B21]">Породу не знайдено</h1>
                <Link to="/encyclopedia" className="bg-[#1A2B21] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#2D4739] transition-all">
                    ← Повернутися
                </Link>
            </div>
        </div>
    );

    // ── Data extraction ───────────────────────────────────────────────────────
    const temperament      = Array.isArray(breed.temperament)      ? breed.temperament      : [];
    const healthFeatures   = Array.isArray(breed.health_features)  ? breed.health_features  : [];
    const characterFeatures= Array.isArray(breed.character_features)? breed.character_features : [];

    // Collect every image stored on the document in order
    const galleryImages = [
        breed.image_url,
        breed.image_url1,
        breed.image_url2,
        breed.image_url3,
        breed.image_url4,
        ...(Array.isArray(breed.gallery) ? breed.gallery : []),
    ].filter(Boolean);

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#F6F3F2]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-6">

                {/* Back link */}
                <Link
                    to="/encyclopedia"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#6B7280] hover:text-[#1A2B21] transition-colors group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
                    Енциклопедія порід
                </Link>

                {/* ── HERO BLOCK ── */}
                <div className="bg-white rounded-[40px] shadow-sm border border-[#EAE8E7] overflow-hidden flex flex-col md:flex-row min-h-[420px]">

                    {/* Image — full bleed, no padding */}
                    <div className="md:w-[52%] shrink-0 h-72 md:h-auto relative">
                        <img
                            src={breed.image_url || '/buddy-large.jpg'}
                            alt={breed.name}
                            className="w-full h-full object-cover"
                        />
                        {/* Size badge on image */}
                        {breed.size && (
                            <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-[#1A2B21] text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wide">
                                {breed.size}
                            </span>
                        )}
                    </div>

                    {/* Info panel */}
                    <div className="flex-1 p-8 md:p-12 flex flex-col justify-between gap-6">
                        <div className="space-y-4">
                            {/* Origin */}
                            {breed.origin && (
                                <p className="text-sm font-inter text-[#6B7280] flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#B0CDBB] inline-block" />
                                    {breed.origin}
                                </p>
                            )}

                            {/* Name */}
                            <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-[#1A2B21] uppercase leading-tight tracking-tight">
                                {breed.name}
                            </h1>

                            {/* Temperament tags */}
                            {temperament.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {temperament.map(t => (
                                        <span
                                            key={t}
                                            className="bg-[#1A2B21] text-white text-[11px] font-bold px-3 py-1.5 rounded-full font-inter"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Stat pills row */}
                        <div className="grid grid-cols-2 gap-3">
                            <Pill label="Розмір"          value={breed.size} />
                            <Pill label="Тривалість"      value={breed.life_expectancy} />
                            <Pill label="Країна походження" value={breed.origin} />
                            <Pill label="Тип"             value={breed.type || breed.group || breed.category} />
                        </div>
                    </div>
                </div>

                {/* ── CONTENT BLOCKS — 2-column grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Description */}
                    {breed.description && (
                        <Block title="Опис породи" accent="bg-[#F6F3F2] text-[#1A2B21]">
                            <p className="font-inter text-[15px] leading-relaxed text-[#424844]">
                                {breed.description}
                            </p>
                        </Block>
                    )}

                    {/* Historical background */}
                    {breed.historical_background && (
                        <Block title="Історична довідка" accent="bg-[#F6F3F2] text-[#1A2B21]">
                            <p className="font-inter text-[15px] leading-relaxed text-[#424844]">
                                {breed.historical_background}
                            </p>
                        </Block>
                    )}

                    {/* Character features */}
                    {characterFeatures.length > 0 && (
                        <Block title="Характер та поведінка" accent="bg-[#EEFAF3] text-[#1A4D31]">
                            <ul className="space-y-3">
                                {characterFeatures.map((feat, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        {/* Green check */}
                                        <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-[#B0CDBB] flex items-center justify-center">
                                            <svg viewBox="0 0 12 10" fill="none" className="w-3 h-3">
                                                <path d="M1 5l3.5 3.5L11 1" stroke="#1A2B21" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </span>
                                        <span className="font-inter text-[14px] text-[#424844] leading-relaxed">{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </Block>
                    )}

                    {/* Health features */}
                    {healthFeatures.length > 0 && (
                        <Block title="Особливості здоров'я" accent="bg-[#FEF6EE] text-[#7C4A1E]">
                            <ul className="space-y-3">
                                {healthFeatures.map((feat, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        {/* Amber warning dot */}
                                        <span className="mt-1 shrink-0 w-4 h-4 rounded-full bg-[#F2C9B3] border border-[#FEAE87] flex items-center justify-center">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#D9774E] block" />
                                        </span>
                                        <span className="font-inter text-[14px] text-[#424844] leading-relaxed">{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </Block>
                    )}
                </div>

                {/* ── GALLERY BLOCK — full width ── */}
                {galleryImages.length > 0 && (
                    <div className="bg-white rounded-[32px] shadow-sm border border-[#EAE8E7] overflow-hidden">
                        <div className="px-8 py-5 border-b border-[#EAE8E7] bg-[#F6F3F2] flex items-center justify-between">
                            <h2 className="font-montserrat font-bold text-[15px] uppercase tracking-widest text-[#1A2B21]">
                                Галерея
                            </h2>
                            <span className="text-[11px] font-bold text-[#6B7280]">
                                {galleryImages.length} фото
                            </span>
                        </div>
                        <div className="p-6">
                            {/* First image is large (hero of gallery), rest are smaller */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* First image spans 2 cols and 2 rows */}
                                {galleryImages[0] && (
                                    <div className="col-span-2 row-span-2 aspect-[4/3] md:aspect-auto md:h-72 rounded-2xl overflow-hidden group shadow-sm border border-[#EAE8E7]">
                                        <img
                                            src={galleryImages[0]}
                                            alt={`${breed.name} — головне фото`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                )}
                                {/* Remaining images */}
                                {galleryImages.slice(1).map((url, i) => (
                                    <div
                                        key={i}
                                        className="aspect-square rounded-2xl overflow-hidden group shadow-sm border border-[#EAE8E7]"
                                    >
                                        {url
                                            ? <img
                                                src={url}
                                                alt={`${breed.name} — фото ${i + 2}`}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                              />
                                            : <div className="w-full h-full bg-[#F6F3F2]" />
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── CTA BLOCK ── */}
                <div className="bg-[#1A2B21] rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest mb-1">DogLore</p>
                        <h3 className="text-2xl font-montserrat font-bold text-white leading-snug">
                            У вас є {breed.name}?<br />
                            <span className="text-[#98B5A3]">Ведіть його профіль у додатку.</span>
                        </h3>
                    </div>
                    <Link
                        to="/auth"
                        className="shrink-0 bg-white text-[#1A2B21] px-8 py-4 rounded-2xl font-montserrat font-bold text-sm hover:bg-[#F6F3F2] transition-all shadow-md relative z-10"
                    >
                        Створити профіль
                    </Link>
                    <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute -left-6 -bottom-10 w-36 h-36 bg-white/5 rounded-full blur-2xl" />
                </div>

            </main>

            <footer className="py-10 text-center text-[#6B7280] text-sm border-t border-[#EAE8E7] mt-6">
                © 2026 DogLore. Всі права захищені.
            </footer>
        </div>
    );
}
