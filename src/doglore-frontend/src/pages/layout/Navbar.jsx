import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="flex justify-between items-center py-5 px-6 md:px-16 bg-transparent">
            {/* Логотип тепер веде на головну */}
            <Link to="/" className="text-2xl font-montserrat font-bold text-brand-primary">
                DogLore
            </Link>

            <ul className="hidden md:flex gap-10 font-inter text-sm font-medium text-text-secondary">
                <li>
                    <Link to="/profile" className="cursor-pointer hover:text-brand-primary">Мій собака</Link>
                </li>
                <li>
                    <Link to="/training" className="cursor-pointer hover:text-brand-primary">Трекінг</Link>
                </li>
                <li>
                    <Link to="/encyclopedia" className="cursor-pointer hover:text-brand-primary">Енциклопедія</Link>
                </li>
            </ul>

            <div className="flex gap-4 items-center">
                <button className="p-2 text-text-secondary">🔔</button>
                <Link to="/profile" className="p-2 text-text-secondary">👤</Link>
            </div>
        </nav>
    );
}