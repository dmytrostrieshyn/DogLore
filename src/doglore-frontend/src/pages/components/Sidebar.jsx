import { Link, NavLink } from 'react-router-dom';

export default function Sidebar() {
    // Базові стилі для посилань
    const linkStyles = "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200";
    // Стилі для неактивного стану
    const inactiveStyles = "text-text-secondary hover:bg-surface-primary hover:text-brand-primary";
    // Стилі для активного стану (темно-зелений фон, як у макеті)
    const activeStyles = "bg-brand-secondary text-white shadow-md";

    return (
        <aside className="w-64 bg-bg-warm h-screen p-6 border-r border-surface-primary hidden md:block sticky top-0">
            {/* Профіль собаки - клікабельний, веде на сторінку профілю */}
            <Link to="/profile" className="flex items-center gap-3 mb-10 hover:opacity-80 transition group">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-brand-primary ring-2 ring-transparent group-hover:ring-brand-accent">
                    <img src="/buddy-avatar.jpg" alt="Buddy" className="object-cover w-full h-full" />
                </div>
                <div>
                    <h4 className="font-bold text-text-primary text-sm">Buddy</h4>
                    <p className="text-[10px] text-text-muted uppercase tracking-tighter">Golden Retriever</p>
                </div>
            </Link>

            <nav className="space-y-2">
                {/* Посилання на Профіль */}
                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `${linkStyles} ${isActive ? activeStyles : inactiveStyles}`
                    }
                >
                    <span>🐾</span> Профіль
                </NavLink>

                {/* Посилання на Щоденник/Трекінг */}
                <NavLink
                    to="/training"
                    className={({ isActive }) =>
                        `${linkStyles} ${isActive ? activeStyles : inactiveStyles}`
                    }
                >
                    <span>📖</span> Щоденник
                </NavLink>
            </nav>

            {/* Кнопка дії (можна залишити кнопкою або теж зробити Link) */}
            <button className="w-full mt-6 bg-brand-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-secondary transition-colors shadow-sm">
                <span className="text-xl">+</span> Додати запис
            </button>
        </aside>
    );
}