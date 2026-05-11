// src/sections/Hero.jsx
export default function Hero() {
    return (
        <section className="flex flex-col md:flex-row items-center gap-12 py-16 px-6 md:px-16">
            <div className="md:w-1/2">
                <h1 className="h1 mb-6">DogLore: Ваше джерело знань та турботи про собак</h1>
                <p className="body-standard mb-10 max-w-lg">
                    Ми створюємо цифровий затишок для власників собак, де наукові знання поєднуються з щоденною турботою...
                </p>
                <div className="flex gap-4">
                    <button className="btn-primary">До енциклопедії</button>
                    <button className="px-6 py-3 border-2 border-brand-primary rounded-lg font-montserrat font-semibold text-brand-primary hover:bg-surface-primary transition-all">
                        Створити профіль собаки
                    </button>
                </div>
            </div>

            <div className="md:w-1/2 relative">
                <div className="rounded-[40px] overflow-hidden shadow-xl">
                    <img src="/hero-dog.jpg" alt="Girl with dog" className="w-full object-cover" />
                </div>
                {/* Картка трекінгу (floating card) */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-lg border border-surface-primary max-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-red-400">❤️</span>
                        <span className="text-[12px] font-bold">Щоденна мета</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-primary w-[70%]" />
                    </div>
                    <p className="text-[10px] mt-2 text-text-muted font-inter">3.5 км пройдено сьогодні</p>
                </div>
            </div>
        </section>
    );
}