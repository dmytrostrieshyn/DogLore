import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Training from './pages/Training';
import DogProfile from './pages/DogProfile';
import Encyclopedia from './pages/Encyclopedia';
import BreedDetails from './pages/BreedDetails';
import Auth from './pages/Auth';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/auth" replace />;
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/encyclopedia" element={<Encyclopedia />} />
                    <Route path="/encyclopedia/:breedId" element={<BreedDetails />} />
                    <Route path="/profile" element={<ProtectedRoute><DogProfile /></ProtectedRoute>} />
                    <Route path="/training" element={<ProtectedRoute><Training /></ProtectedRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;