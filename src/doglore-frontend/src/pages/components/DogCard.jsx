export default function DogCard({ name, size, description, type, image }) {
    return (
        <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-surface-primary hover:shadow-md transition-shadow group">
            <div className="relative h-64">
                <img src={image} alt={name} className="w-full h-full object-cover transition transform group-hover:scale-105" />
                <span className="absolute top-4 left-4 bg-brand-accent/80 backdrop-blur-sm text-brand-earth text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    {type}
                </span>
            </div>
            <div className="p-6">
                <h3 className="h2 text-xl mb-1">{name}</h3>
                <p className="text-[12px] text-text-muted mb-4 flex items-center gap-1">
                    🏠 {size}
                </p>
                <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
}