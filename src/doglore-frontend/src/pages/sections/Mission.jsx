// src/sections/Mission.jsx
export default function Mission() {
    return (
        <section className="px-6 md:px-16 mb-20">
            {/* Місія */}
            <div className="bg-surface-dark p-12 rounded-[40px] text-white flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="md:w-2/3">
                    <h3 className="text-2xl font-bold mb-4">Місія проекту</h3>
                    <p className="text-white/70">Ми віримо, що щасливий собака починається з обізнаного власника...</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white/10 p-6 rounded-2xl text-center min-w-[100px]">
                        <div className="text-2xl font-bold">500+</div>
                        <div className="text-[10px] text-white/50">Порад</div>
                    </div>
                    <div className="bg-white/10 p-6 rounded-2xl text-center min-w-[100px]">
                        <div className="text-2xl font-bold">120+</div>
                        <div className="text-[10px] text-white/50">Порід</div>
                    </div>
                </div>
            </div>

            {/* Готові почати подорож? */}
            <div className="mt-20 text-center">
                <h2 className="h2 mb-6 text-4xl">Готові почати подорож?</h2>
                <p className="body-standard mb-10">Приєднуйтесь до тисяч власників, які вже зробили догляд простішим.</p>
                <div className="flex justify-center gap-4">
                    <button className="btn-primary">Створити профіль собаки</button>
                    <button className="px-8 py-3 bg-white border border-surface-primary rounded-full font-bold">Дізнатись більше</button>
                </div>
            </div>
        </section>
    );
}