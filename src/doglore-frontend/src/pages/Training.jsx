import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './layout/Navbar';
import { fetchTrainingLogs, updateTrainingNotes } from '../services/api/trainingApi';

export default function Training() {
    const [commands, setCommands] = useState([]);
    const [notes, setNotes] = useState('');
    const dogId = "test_dog_id";

    useEffect(() => {
        fetchTrainingLogs(dogId).then(setCommands);
    }, [dogId]);

    return (
        <div className="min-h-screen bg-bg-main">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8 md:p-12">
                    <h1 className="h1 text-3xl mb-10">Прогрес дресирування</h1>
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-surface-primary max-w-2xl">
                        <h3 className="text-xl font-bold mb-8">Активні команди</h3>
                        <div className="space-y-6">
                            {commands?.map((cmd, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span>{cmd.name}</span>
                                        <span className="text-brand-primary">{cmd.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-brand-primary transition-all" style={{ width: `${cmd.progress}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}