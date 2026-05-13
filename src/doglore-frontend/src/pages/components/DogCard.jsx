import { Link } from 'react-router-dom';

export default function DogCard({ id, name, size, description, type, image, temperament }) {
    return (
        <Link
            to={`/encyclopedia/${id}`}
            className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-surface-primary hover:shadow-md hover:-translate-y-1 transition-all duration-300 group flex flex-col"
        >
            <div className="relative h-56">
                <img
                    src={image || '/buddy-large.jpg'}
                    alt={name}
                    className="w-full h-full object-cover transition transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 bg-[#F2C9B3] text-[#4A3B32] text-[10px] font-bold px-3 py-1.5 rounded-full">
                    {type || temperament || 'Порода'}
                </span>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-montserrat font-bold text-xl mb-1 text-text-primary">{name}</h3>
                <p className="text-[12px] text-text-muted mb-4 flex items-center gap-2 font-bold">
                    <span className="grayscale opacity-70">🏠</span> {size || 'Середній'}
                </p>
                <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed">
                    {description || "Детальний опис цієї породи скоро з'явиться..."}
                </p>

                <div className="mt-auto pt-4">
                    <span className="text-[11px] font-bold text-[#1A2B21] flex items-center gap-1 group-hover:gap-2 transition-all">
                        Детальніше <span>→</span>
                    </span>
                </div>
            </div>
        </Link>
    );
}
