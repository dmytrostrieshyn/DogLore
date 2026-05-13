import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { fetchDogFullProfile } from '../../services/api/dogsApi';
import { useAuth } from '../../context/AuthContext';

// Імпортуємо фірмові SVG-іконки
import pawIcon from '../../assets/icons/paw.svg';
import encyclopediaIcon from '../../assets/icons/encyclopedia.svg';
import addIcon from '../../assets/icons/add.svg';

export default function Sidebar() {
    const { dogId, logout } = useAuth();
    const [dog, setDog] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleAddEntry = () => {
        if (location.pathname === '/profile') {
            document.getElementById('journal-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            navigate('/profile', { state: { scrollTo: 'journal' } });
        }
    };

    // Витягуємо міні-профіль для шапки сайдбару
    useEffect(() => {
        if (!dogId) return;
        fetchDogFullProfile(dogId)
            .then(data => {
                if (data) setDog(data);
            })
            .catch(err => console.error("Помилка завантаження сайдбару:", err));
    }, [dogId]);

    // Базові стилі для посилань (відступи, заокруглення)
    const linkStyles = "w-full flex items-center gap-3 px-4 py-3.5 rounded-[16px] font-bold transition-all duration-200 group";
    
    // Стилі для неактивного стану (сірий текст, при наведенні стає трохи темнішим)
    const inactiveStyles = "text-text-secondary hover:bg-white hover:shadow-sm hover:text-[#1A2B21]";
    
    // Стилі для активного стану (темно-зелений фон, білий текст, як у Фігмі)
    const activeStyles = "bg-[#1A2B21] text-white shadow-md";

    return (
        <aside className="w-64 bg-bg-warm h-screen p-6 border-r border-surface-primary hidden md:block sticky top-0">
            
            {/* Профіль собаки (динамічний) */}
            <Link to="/profile" className="flex items-center gap-4 mb-10 hover:opacity-80 transition group">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-sm ring-2 ring-transparent group-hover:ring-[#F2C9B3] transition-all">
                    <img 
                        src={dog?.image_url || "/buddy-large.jpg"} 
                        alt={dog?.name || "Buddy"} 
                        className="object-cover w-full h-full" 
                    />
                </div>
                <div>
                    <h4 className="font-bold text-[#1A2B21] text-sm font-montserrat">
                        {dog?.name || "Завантаження..."}
                    </h4>
                    <p className="text-[10px] text-text-muted uppercase tracking-tighter font-bold mt-0.5">
                        {dog?.breedInfo?.name || "Порода"}
                    </p>
                </div>
            </Link>

            <nav className="space-y-3">
                {/* Посилання на Профіль */}
                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `${linkStyles} ${isActive ? activeStyles : inactiveStyles}`
                    }
                >
                    {/* Використовуємо функцію React Router, щоб міняти колір іконки залежно від isActive */}
                    {({ isActive }) => (
                        <>
                            <img 
                                src={pawIcon} 
                                alt="Профіль" 
                                // Якщо активне - робимо білим (invert brightness-0), інакше - напівпрозоре
                                className={`w-5 h-5 transition-all ${isActive ? 'invert brightness-0' : 'opacity-60 group-hover:opacity-100'}`} 
                            />
                            Профіль
                        </>
                    )}
                </NavLink>

                {/* Посилання на Щоденник/Трекінг */}
                <NavLink
                    to="/training"
                    className={({ isActive }) =>
                        `${linkStyles} ${isActive ? activeStyles : inactiveStyles}`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <img 
                                src={encyclopediaIcon} 
                                alt="Щоденник" 
                                className={`w-5 h-5 transition-all ${isActive ? 'invert brightness-0' : 'opacity-60 group-hover:opacity-100'}`} 
                            />
                            Щоденник
                        </>
                    )}
                </NavLink>
            </nav>

            {/* Кнопка дії з іконкою add.svg */}
            <button
                onClick={handleAddEntry}
                className="w-full mt-6 bg-[#1A2B21] text-white py-4 rounded-[16px] font-bold flex items-center justify-center gap-3 hover:bg-opacity-90 transition-all shadow-md active:scale-95"
            >
                <img src={addIcon} alt="Додати" className="w-4 h-4 invert brightness-0" />
                Додати запис
            </button>

            <button
                onClick={logout}
                className="w-full mt-3 text-text-muted text-xs font-bold py-2 rounded-[16px] hover:bg-white hover:text-[#1A2B21] transition-all"
            >
                Вийти
            </button>
        </aside>
    );
}