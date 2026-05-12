import { Link } from 'react-router-dom';
// Імпортуємо іконки
import notificationIcon from '../../assets/icons/notification.svg';
import profileIcon from '../../assets/icons/profile.svg';

export default function Navbar() {
    return (
        <nav className="flex justify-between items-center py-5 px-6 md:px-16 bg-white shadow-sm border-b border-surface-primary sticky top-0 z-50">
            {/* Додали bg-white, тінь, бордер та sticky для закріплення */}
            
            {/* Логотип (темно-зелений, як у Фігмі) */}
            <Link to="/" className="text-2xl font-montserrat font-black text-[#1A2B21] tracking-tight hover:opacity-80 transition-opacity">
                DogLore
            </Link>

            {/* Центральні посилання */}
            <ul className="hidden md:flex gap-10 font-inter text-sm font-bold text-text-secondary">
                <li>
                    <Link to="/profile" className="cursor-pointer hover:text-[#1A2B21] transition-colors">Мій собака</Link>
                </li>
                <li>
                    <Link to="/training" className="cursor-pointer hover:text-[#1A2B21] transition-colors">Трекінг</Link>
                </li>
                <li>
                    <Link to="/encyclopedia" className="cursor-pointer hover:text-[#1A2B21] transition-colors">Енциклопедія</Link>
                </li>
            </ul>

            {/* Іконки профілю та сповіщень */}
            <div className="flex gap-4 items-center">
                <button className="p-2.5 hover:bg-[#F8F9FA] rounded-full transition-colors group">
                    <img src={notificationIcon} alt="Сповіщення" className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </button>
                <Link to="/auth" className="p-2.5 hover:bg-[#F8F9FA] rounded-full transition-colors group">
                    <img src={profileIcon} alt="Профіль" className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </Link>
            </div>
        </nav>
    );
}