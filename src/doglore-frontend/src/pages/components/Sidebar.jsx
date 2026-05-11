// src/components/Sidebar.jsx
export default function Sidebar() {
    return (
        <aside className="w-64 bg-bg-warm h-screen p-6 border-r border-surface-primary hidden md:block">
            {/* Профіль собаки */}
            <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-brand-primary">
                    <img src="/buddy-avatar.jpg" alt="Buddy" className="object-cover w-full h-full" />
                </div>
                <div>
                    <h4 className="font-bold text-text-primary text-sm">Buddy</h4>
                    <p className="text-[10px] text-text-muted uppercase tracking-tighter">Golden Retriever</p>
                </div>
            </div>

            <nav className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-surface-primary rounded-xl transition">
                    <span>🐾</span> Профіль
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-brand-secondary text-white rounded-xl shadow-md">
                    <span>📖</span> Щоденник
                </button>
            </nav>

            <button className="w-full mt-6 bg-brand-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90">
                <span className="text-xl">+</span> Додати запис
            </button>
        </aside>
    );
}