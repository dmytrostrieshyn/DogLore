import { Link } from 'react-router-dom';
import likeIcon from '../../assets/icons/like.svg';

export default function Hero() {
    return (
        <section className="flex flex-col md:flex-row items-center gap-12 py-16 px-6 md:px-16">
            <div className="md:w-1/2">
                <h1 className="h1 mb-6 text-5xl font-montserrat font-bold text-[#1A2B21] leading-tight">
                    DogLore: Ваше джерело знань та турботи про собак
                </h1>
                <p className="body-standard mb-10 max-w-lg text-lg text-text-secondary leading-relaxed">
                    Ми створюємо цифровий затишок для власників собак, де наукові знання поєднуються з щоденною турботою. Відкрийте для себе світ кращого розуміння вашого улюбленця.
                </p>
                <div className="flex gap-4">
                    {/* Кнопка до Енциклопедії */}
                    <Link to="/encyclopedia" className="bg-[#1A2B21] text-white px-8 py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center justify-center shadow-md">
                        До енциклопедії
                    </Link>

                    {/* Кнопка до створення профілю */}
                    <Link
                        to="/profile"
                        className="px-8 py-4 bg-transparent border-2 border-[#1A2B21] rounded-xl font-bold text-[#1A2B21] hover:bg-surface-primary transition-all flex items-center justify-center"
                    >
                        Створити профіль собаки
                    </Link>
                </div>
            </div>

            <div className="md:w-1/2 relative mt-8 md:mt-0">
                {/* Контейнер для фото з правильними пропорціями (як у Фігмі) */}
                <div className="rounded-[32px] overflow-hidden shadow-xl aspect-[4/3] w-full bg-bg-main border-4 border-white">
                    <img 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN2UZ6AC5OA6YnHzNOBBZNY5QmH_c4DmriYw&s" 
                        alt="Girl with dog" 
                        className="w-full h-full object-cover" 
                    />
                </div>
                
                {/* Картка "Щоденна мета" (посунута вліво і перефарбована) */}
                <Link to="/training" className="absolute -bottom-6 -left-4 md:-left-10 bg-white p-6 rounded-[24px] shadow-xl border border-surface-primary w-[240px] hover:scale-105 transition-transform z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <img src={likeIcon} alt="Мета" className="w-5 h-5 opacity-80" />
                        <span className="text-sm font-bold text-[#1A2B21] font-montserrat">Щоденна мета</span>
                    </div>
                    {/* Персикова смуга прогресу */}
                    <div className="h-2 w-full bg-[#F9ECE4] rounded-full overflow-hidden">
                        <div className="h-full bg-[#F2C9B3] w-[70%]" />
                    </div>
                    <p className="text-[11px] mt-3 text-text-muted font-inter font-bold">3.5 км пройдено сьогодні</p>
                </Link>
            </div>
        </section>
    );
}