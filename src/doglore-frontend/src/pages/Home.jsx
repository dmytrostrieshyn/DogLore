import Navbar from './layout/Navbar.jsx';
import Hero from './sections/Hero.jsx';
import Features from './sections/Features.jsx';
import Mission from './sections/Mission.jsx';

export default function Home() {
    return (
        <div className="bg-bg-main min-h-screen">
            <Navbar />
            <Hero />
            <Features />
            <Mission />
            <footer className="py-10 text-center text-text-muted text-sm border-t border-surface-primary">
                © 2026 DogLore. Всі права захищені.
            </footer>
        </div>
    );
}