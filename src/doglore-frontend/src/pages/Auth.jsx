import { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Поля для профілю собаки (тільки для реєстрації)
  const [dogName, setDogName] = useState('');
  const [dogAge, setDogAge] = useState('');
  const [dogBreed, setDogBreed] = useState('');
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // Логіка входу
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/profile');
      } else {
        // Логіка реєстрації
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Створення документа користувача у Firestore 
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          dogName: dogName,
          dogAge: Number(dogAge),
          dogBreed: dogBreed,
          createdAt: serverTimestamp(),
          avatarUrl: "",
          weightHistory: [],
          trainingSteps: []
        });

        navigate('/profile');
      }
    } catch (err) {
      setError("Помилка: " + err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {isLogin ? 'Вхід у DogLore' : 'Реєстрація у DogLore'}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Ваш Email"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Кличка собаки"
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={dogName}
                onChange={(e) => setDogName(e.target.value)}
                required
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Вік (років)"
                  className="border p-3 rounded-lg w-1/3 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={dogAge}
                  onChange={(e) => setDogAge(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Порода"
                  className="border p-3 rounded-lg w-2/3 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={dogBreed}
                  onChange={(e) => setDogBreed(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <input
            type="password"
            placeholder="Пароль"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button 
            type="submit" 
            className="bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            {isLogin ? 'Увійти' : 'Створити аккаунт'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? 'Ще не з нами?' : 'Вже маєте аккаунт?'}
          </p>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-bold hover:underline mt-1"
          >
            {isLogin ? 'Зареєструватися' : 'Увійти до кабінету'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;