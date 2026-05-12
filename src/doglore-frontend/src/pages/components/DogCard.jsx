export default function DogCard({ name, size, description, type, image, temperament }) {
    return (
        <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-surface-primary hover:shadow-md transition-shadow group flex flex-col">
            <div className="relative h-56"> {/* Трохи зменшив висоту, щоб пропорції були як у Фігмі */}
                <img 
                    src={image || "/buddy-large.jpg"} 
                    alt={name} 
                    className="w-full h-full object-cover transition transform duration-500 group-hover:scale-105" 
                />
                
                {/* Виправлений бейдж: точні HEX-кольори з Фігми та нормальний padding */}
                <span className="absolute top-4 left-4 bg-[#F2C9B3] text-[#4A3B32] text-[10px] font-bold px-3 py-1.5 rounded-full">
                    {type || temperament}
                </span>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-montserrat font-bold text-xl mb-1 text-text-primary">{name}</h3>
                
                <p className="text-[12px] text-text-muted mb-4 flex items-center gap-2 font-bold">
                    {/* Зробив емодзі сірим, щоб він виглядав як іконка з Фігми */}
                    <span className="grayscale opacity-70">🏠</span> {size || "Середній"}
                </p>
                
                <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed">
                    {description || "Детальний опис цієї породи скоро з'явиться..."}
                </p>
            </div>
        </div>
    );
}