import { Link } from 'react-router-dom';

export default function Hero() {
    return (
        <section className="flex flex-col md:flex-row items-center gap-12 py-16 px-6 md:px-16">
            <div className="md:w-1/2">
                <h1 className="h1 mb-6 text-5xl">DogLore: Ваше джерело знань та турботи про собак</h1>
                <p className="body-standard mb-10 max-w-lg text-lg">
                    Ми створюємо цифровий затишок для власників собак, де наукові знання поєднуються з щоденною турботою.
                </p>
                <div className="flex gap-4">
                    {/* Кнопка до Енциклопедії */}
                    <Link to="/encyclopedia" className="btn-primary flex items-center justify-center">
                        До енциклопедії
                    </Link>

                    {/* Кнопка до створення профілю */}
                    <Link
                        to="/profile"
                        className="px-6 py-3 border-2 border-brand-primary rounded-lg font-montserrat font-semibold text-brand-primary hover:bg-surface-primary transition-all flex items-center justify-center"
                    >
                        Створити профіль собаки
                    </Link>
                </div>
            </div>

            <div className="md:w-1/2 relative">
                <div className="rounded-[40px] overflow-hidden shadow-xl border-8 border-white">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN2UZ6AC5OA6YnHzNOBBZNY5QmH_c4DmriYw&s" alt="Girl with dog" className="w-full h-full object-cover" />
                </div>
                {/* Картка трекінгу */}
                <Link to="/training" className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-2xl border border-surface-primary max-w-[220px] hover:scale-105 transition-transform">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-red-400 text-xl">❤️</span>
                        <span className="text-sm font-bold text-brand-primary font-montserrat">Щоденна мета</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-accent w-[70%]" />
                    </div>
                    <p className="text-[11px] mt-3 text-text-muted font-inter font-medium">3.5 км пройдено сьогодні</p>
                </Link>
            </div>
        </section>
    );
}