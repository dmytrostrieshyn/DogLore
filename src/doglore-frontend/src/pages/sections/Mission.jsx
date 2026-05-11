import { Link } from 'react-router-dom';

export default function Mission() {
    return (
        <section className="px-6 md:px-16 mb-20">
            {/* ... (блок з місією залишається без змін) ... */}

            {/* Готові почати подорож? */}
            <div className="mt-20 text-center bg-bg-warm p-16 rounded-[40px] border border-surface-primary">
                <h2 className="h2 mb-6 text-4xl">Готові почати подорож?</h2>
                <p className="body-standard mb-10 text-lg opacity-80">
                    Приєднуйтесь до тисяч власників, які вже зробили догляд за своїми улюбленцями простішим та приємнішим.
                </p>
                <div className="flex justify-center gap-6">
                    <Link to="/profile" className="btn-primary px-10 shadow-lg hover:shadow-xl transition-shadow">
                        Створити профіль собаки
                    </Link>
                    <Link
                        to="/encyclopedia"
                        className="px-10 py-4 bg-white border border-surface-primary rounded-xl font-montserrat font-bold text-brand-primary hover:bg-gray-50 transition-colors"
                    >
                        Дізнатись більше
                    </Link>
                </div>
            </div>
        </section>
    );
}