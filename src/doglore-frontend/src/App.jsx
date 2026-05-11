import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Training from './pages/Training';
import DogProfile from './pages/DogProfile';
import Encyclopedia from './pages/Encyclopedia';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/training" element={<Training />} />
                <Route path="/profile" element={<DogProfile />} />
                <Route path="/encyclopedia" element={<Encyclopedia />} />
            </Routes>
        </Router>
    );
}

export default App;