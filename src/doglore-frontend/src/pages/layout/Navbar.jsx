import { Link } from 'react-router-dom';
// Імпортуємо іконки. Шлях розрахований так: виходимо з layout -> виходимо з pages -> заходимо в assets
import notificationIcon from '../../assets/icons/notification.svg';
import profileIcon from '../../assets/icons/profile.svg';

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
                <button className="p-2 hover:opacity-80 transition-opacity">
                    <img src={notificationIcon} alt="Сповіщення" className="w-6 h-6" />
                </button>
                <Link to="/profile" className="p-2 hover:opacity-80 transition-opacity">
                    <img src={profileIcon} alt="Профіль" className="w-6 h-6" />
                </Link>
            </div>
        </nav>
    );
}