import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { registerDog } from '../services/api/dogsApi';
import { useAuth } from '../context/AuthContext';

const pawPrint = (
    <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full">
        <ellipse cx="14" cy="18" rx="6" ry="8" />
        <ellipse cx="32" cy="12" rx="6" ry="8" />
        <ellipse cx="50" cy="18" rx="6" ry="8" />
        <path d="M32 28c-10 0-20 6-20 16 0 8 6 14 20 14s20-6 20-14c0-10-10-16-20-16z" />
    </svg>
);

const EyeIcon = ({ open }) =>
    open ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );

const FIREBASE_ERRORS = {
    'auth/email-already-in-use': 'Ця електронна адреса вже використовується.',
    'auth/invalid-email': 'Невірний формат електронної адреси.',
    'auth/weak-password': 'Пароль повинен містити щонайменше 6 символів.',
    'auth/user-not-found': 'Акаунт з такою адресою не знайдено.',
    'auth/wrong-password': 'Невірний пароль.',
    'auth/invalid-credential': 'Невірна електронна адреса або пароль.',
    'auth/too-many-requests': 'Забагато спроб. Спробуйте пізніше.',
    'auth/operation-not-allowed': 'Вхід через email/пароль не увімкнено. Зверніться до адміністратора.',
    'auth/configuration-not-found': 'Автентифікацію не налаштовано. Увімкніть Email/Password у Firebase Console.',
};

export default function Auth() {
    const { user, setDogId } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [dogName, setDogName] = useState('');
    const [dogAge, setDogAge] = useState('');
    const [dogBreed, setDogBreed] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    // Signals that auth actions completed — navigate only once user is in context
    const [readyToRedirect, setReadyToRedirect] = useState(false);
    const navigate = useNavigate();

    // If already logged in on mount, redirect immediately
    useEffect(() => {
        if (user) navigate('/profile', { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Navigate once context has confirmed user AND we finished our writes
    useEffect(() => {
        if (user && readyToRedirect) navigate('/profile', { replace: true });
    }, [user, readyToRedirect, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                // Don't navigate directly — wait for useEffect to see user in context
                setReadyToRedirect(true);
            } else {
                const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);

                // 1. Create the dog document — registerDog returns the new Firestore ID
                const newDogId = await registerDog({
                    name: dogName,
                    dogAge: Number(dogAge),
                    breedName: dogBreed,
                    userId: newUser.uid,
                    image_url: '',
                    gender: '',
                    color: '',
                    height: '',
                    activityLevel: '',
                    chipNumber: '',
                    foodType: '',
                    nextVaccination: null,
                    trainingNotes: '',
                    completedTrainingDates: [],
                });

                // 2. Create user document with the dogId link
                await setDoc(doc(db, 'users', newUser.uid), {
                    email: newUser.email,
                    dogId: newDogId,
                    createdAt: serverTimestamp(),
                });

                // 3. Push dogId into context immediately so DogProfile doesn't spin
                setDogId(newDogId);
                setReadyToRedirect(true);
            }
        } catch (err) {
            setError(FIREBASE_ERRORS[err.code] || 'Сталася помилка. Спробуйте ще раз.');
            setLoading(false);
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setEmail('');
        setPassword('');
        setDogName('');
        setDogAge('');
        setDogBreed('');
    };

    return (
        <div className="min-h-screen bg-[#F6F3F2] flex flex-col">
            {/* Navbar */}
            <nav className="flex justify-between items-center py-5 px-6 md:px-16 bg-white shadow-sm border-b border-[#EAE8E7] sticky top-0 z-50">
                <Link to="/" className="text-2xl font-montserrat font-black text-[#1A2B21] tracking-tight hover:opacity-80 transition-opacity">
                    DogLore
                </Link>
                <div className="text-sm font-inter text-[#424844]">
                    {isLogin ? (
                        <>Ще не з нами?{' '}
                            <button onClick={switchMode} className="font-bold text-[#1A2B21] hover:underline">
                                Зареєструватися
                            </button>
                        </>
                    ) : (
                        <>Вже маєте акаунт?{' '}
                            <button onClick={switchMode} className="font-bold text-[#1A2B21] hover:underline">
                                Увійти
                            </button>
                        </>
                    )}
                </div>
            </nav>

            {/* Main content */}
            <div className="flex flex-1 items-center justify-center px-4 py-12">
                <div className="w-full max-w-5xl flex rounded-[32px] overflow-hidden shadow-2xl">

                    {/* Left panel */}
                    <div className="hidden md:flex flex-col justify-between bg-[#1A2B21] text-white p-12 w-[45%] relative overflow-hidden">
                        <div className="absolute -bottom-16 -right-16 w-64 h-64 text-[#2D4739] opacity-40">
                            {pawPrint}
                        </div>
                        <div className="absolute top-8 right-8 w-20 h-20 text-[#2D4739] opacity-30">
                            {pawPrint}
                        </div>

                        <div>
                            <span className="text-3xl font-montserrat font-black tracking-tight">DogLore</span>
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-4xl font-montserrat font-bold leading-tight mb-6">
                                {isLogin
                                    ? 'З поверненням до вашого улюбленця'
                                    : 'Почніть турботу про свого собаку'}
                            </h2>
                            <p className="text-[#98B5A3] font-inter text-base leading-relaxed">
                                {isLogin
                                    ? 'Відстежуйте здоров\'я, тренування та щоденне життя вашого собаки — все в одному місці.'
                                    : 'Створіть профіль свого собаки та отримайте доступ до персоналізованих порад та трекінгу.'}
                            </p>
                        </div>

                        <div className="flex gap-3 relative z-10">
                            {['Профіль собаки', 'Трекінг тренувань', 'Енциклопедія порід'].map((label) => (
                                <span key={label} className="text-xs font-inter font-semibold bg-[#2D4739] text-[#98B5A3] px-3 py-1.5 rounded-full">
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right panel — form */}
                    <div className="flex-1 bg-white p-10 md:p-14 flex flex-col justify-center">
                        <h1 className="text-3xl font-montserrat font-bold text-[#1B1C1C] mb-2">
                            {isLogin ? 'Вхід до акаунту' : 'Створити акаунт'}
                        </h1>
                        <p className="text-[#6B7280] font-inter text-sm mb-8">
                            {isLogin
                                ? 'Введіть ваші дані для входу'
                                : 'Заповніть форму, щоб почати'}
                        </p>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-inter">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold font-inter text-[#424844] uppercase tracking-wide">
                                    Електронна адреса
                                </label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="border border-[#EAE8E7] bg-[#F6F3F2] rounded-xl px-4 py-3 font-inter text-sm text-[#1B1C1C] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#1A2B21] focus:border-transparent transition"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold font-inter text-[#424844] uppercase tracking-wide">
                                    Пароль
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Мінімум 6 символів"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full border border-[#EAE8E7] bg-[#F6F3F2] rounded-xl px-4 py-3 pr-12 font-inter text-sm text-[#1B1C1C] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#1A2B21] focus:border-transparent transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1A2B21] transition-colors"
                                    >
                                        <EyeIcon open={showPassword} />
                                    </button>
                                </div>
                            </div>

                            {!isLogin && (
                                <>
                                    <div className="border-t border-[#EAE8E7] pt-4 mt-1">
                                        <p className="text-xs font-semibold font-inter text-[#424844] uppercase tracking-wide mb-4">
                                            Про вашого собаку
                                        </p>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-semibold font-inter text-[#424844] uppercase tracking-wide">
                                                    Кличка
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Наприклад: Рекс"
                                                    value={dogName}
                                                    onChange={(e) => setDogName(e.target.value)}
                                                    required
                                                    className="border border-[#EAE8E7] bg-[#F6F3F2] rounded-xl px-4 py-3 font-inter text-sm text-[#1B1C1C] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#1A2B21] focus:border-transparent transition"
                                                />
                                            </div>

                                            <div className="flex gap-3">
                                                <div className="flex flex-col gap-1.5 w-1/3">
                                                    <label className="text-xs font-semibold font-inter text-[#424844] uppercase tracking-wide">
                                                        Вік (років)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        placeholder="3"
                                                        min="0"
                                                        max="30"
                                                        value={dogAge}
                                                        onChange={(e) => setDogAge(e.target.value)}
                                                        required
                                                        className="border border-[#EAE8E7] bg-[#F6F3F2] rounded-xl px-4 py-3 font-inter text-sm text-[#1B1C1C] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#1A2B21] focus:border-transparent transition"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1.5 flex-1">
                                                    <label className="text-xs font-semibold font-inter text-[#424844] uppercase tracking-wide">
                                                        Порода
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Наприклад: Лабрадор"
                                                        value={dogBreed}
                                                        onChange={(e) => setDogBreed(e.target.value)}
                                                        required
                                                        className="border border-[#EAE8E7] bg-[#F6F3F2] rounded-xl px-4 py-3 font-inter text-sm text-[#1B1C1C] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#1A2B21] focus:border-transparent transition"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 bg-[#1A2B21] text-white py-3.5 rounded-xl font-montserrat font-bold text-sm hover:bg-[#2D4739] transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Зачекайте...
                                    </>
                                ) : isLogin ? 'Увійти' : 'Створити акаунт'}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm font-inter text-[#6B7280]">
                            {isLogin ? 'Ще не з нами?' : 'Вже маєте акаунт?'}{' '}
                            <button onClick={switchMode} className="font-bold text-[#1A2B21] hover:underline">
                                {isLogin ? 'Зареєструватися' : 'Увійти'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
