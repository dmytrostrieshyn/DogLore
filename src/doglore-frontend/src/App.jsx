import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Auth from './pages/Auth';

// Тимчасові компоненти, поки Богдан і Денис готують контент
const Home = () => (
  <div className="p-10 text-center">
    <h1 className="text-4xl font-bold text-gray-800">Ласкаво просимо до DogLore! 🐾</h1>
    <p className="mt-4 text-gray-600 text-lg">Найкраще місце для вас та вашого улюбленця.</p>
  </div>
);

const Encyclopedia = () => <div className="p-10 text-2xl font-bold">📖 Тут буде енциклопедія порід</div>;
const Profile = () => <div className="p-10 text-2xl font-bold">🐶 Особистий кабінет собаки</div>;

const Navbar = () => (
  <nav className="bg-gray-900 text-white p-4 shadow-lg">
    <div className="container mx-auto flex justify-between items-center">
      <div className="flex gap-6 items-center">
        <Link to="/" className="text-xl font-black tracking-tighter hover:text-blue-400 transition">DOGLORE</Link>
        <Link to="/encyclopedia" className="hover:text-blue-400 transition">Енциклопедія</Link>
        <Link to="/profile" className="hover:text-blue-400 transition">Мій Кабінет</Link>
      </div>
      <div>
        <Link to="/auth" className="bg-blue-600 px-5 py-2 rounded-full font-bold hover:bg-blue-700 transition">
          Увійти
        </Link>
      </div>
    </div>
  </nav>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <main className="container mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/encyclopedia" element={<Encyclopedia />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;