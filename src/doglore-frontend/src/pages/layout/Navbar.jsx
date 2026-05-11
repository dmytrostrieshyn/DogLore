// src/layout/Navbar.jsx
export default function Navbar() {
    return (
        <nav className="flex justify-between items-center py-5 px-6 md:px-16 bg-transparent">
            <div className="text-2xl font-montserrat font-bold text-brand-primary">DogLore</div>

            <ul className="hidden md:flex gap-10 font-inter text-sm font-medium text-text-secondary">
                <li className="cursor-pointer hover:text-brand-primary">Мій собака</li>
                <li className="cursor-pointer hover:text-brand-primary">Трекінг</li>
                <li className="cursor-pointer hover:text-brand-primary">Енциклопедія</li>
            </ul>

            <div className="flex gap-4 items-center">
                <button className="p-2 text-text-secondary"><span className="sr-only">Notifications</span>🔔</button>
                <button className="p-2 text-text-secondary"><span className="sr-only">Profile</span>👤</button>
            </div>
        </nav>
    );
}