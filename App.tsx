import React, { useState, useEffect } from 'react';
import { Home, DollarSign, Camera, CheckSquare, MessageSquare, Sun, UserCheck, Bell } from 'lucide-react';
import HomePage from './components/HomePage';
import ExpensePage from './components/ExpensePage';
import PhotoPage from './components/PhotoPage';
import PlannerPage from './components/PlannerPage';
import ChatPage from './components/ChatPage';
import FriendsPage from './components/FriendsPage';
import { USERS, motivationalQuotes } from './constants';

type Page = 'home' | 'expenses' | 'photos' | 'planner' | 'chat' | 'friends';

const App: React.FC = () => {
    const [activePage, setActivePage] = useState<Page>('home');
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const triggerNotification = (message: string) => {
        setNotificationMessage(message);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
    };

    useEffect(() => {
        // Daily morning quote notification
        const morningCheck = () => {
            const lastShown = localStorage.getItem('morningQuoteDate');
            const today = new Date().toISOString().split('T')[0];
            if (lastShown !== today) {
                const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
                triggerNotification(`Morning Spirit! ✨ ${quote}`);
                localStorage.setItem('morningQuoteDate', today);
            }
        };
        morningCheck();
        const morningInterval = setInterval(morningCheck, 60 * 60 * 1000); // Check every hour

        // Reminder notifications
        const waterReminder = setInterval(() => triggerNotification("💧 Reminder: Stay hydrated! Drink some water."), 2 * 60 * 60 * 1000); // Every 2 hours
        const foodReminder = setInterval(() => triggerNotification("🍎 Reminder: Time to grab a bite and refuel!"), 3.5 * 60 * 60 * 1000); // Every 3.5 hours
        const parentsReminder = setInterval(() => triggerNotification("📞 Reminder: Call your parents and share your adventures!"), 24 * 60 * 60 * 1000); // Once a day

        return () => {
            clearInterval(morningInterval);
            clearInterval(waterReminder);
            clearInterval(foodReminder);
            clearInterval(parentsReminder);
        };
    }, []);

    const renderPage = () => {
        switch (activePage) {
            case 'home':
                return <HomePage />;
            case 'expenses':
                return <ExpensePage />;
            case 'photos':
                return <PhotoPage />;
            case 'planner':
                return <PlannerPage />;
            case 'chat':
                return <ChatPage />;
            case 'friends':
                return <FriendsPage />;
            default:
                return <HomePage />;
        }
    };
    
    const navItems = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'expenses', icon: DollarSign, label: 'Expenses' },
        { id: 'photos', icon: Camera, label: 'Photos' },
        { id: 'planner', icon: CheckSquare, label: 'Planner' },
        { id: 'chat', icon: MessageSquare, label: 'Chat' },
        { id: 'friends', icon: UserCheck, label: 'Friends' },
    ];

    return (
        <div className="min-h-screen font-sans text-gray-800 bg-yellow-50 dark:bg-gray-900 dark:text-gray-200">
            <header className="sticky top-0 z-10 flex items-center justify-between p-4 text-white bg-teal-500 shadow-md">
                <div className="flex items-center space-x-2">
                    <Sun className="w-6 h-6 text-yellow-300" />
                    <h1 className="text-xl font-bold">Manali Trip</h1>
                </div>
                 <div className="relative">
                    <Bell className="w-6 h-6 text-teal-100" />
                    {showNotification && <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>}
                </div>
            </header>
            
            <main className="pb-24 p-4">
                {renderPage()}
            </main>
            
            {showNotification && (
                <div className="fixed z-50 px-4 py-3 text-white transform -translate-x-1/2 rounded-lg shadow-lg bg-pink-500 bottom-24 left-1/2">
                    {notificationMessage}
                </div>
            )}

            <nav className="fixed bottom-0 left-0 right-0 z-10 grid grid-cols-6 gap-1 p-2 bg-white border-t border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActivePage(item.id as Page)}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 ${
                            activePage === item.id ? 'bg-teal-100 text-teal-700 dark:bg-teal-800 dark:text-teal-200' : 'text-gray-500 hover:bg-teal-50 dark:text-gray-400 dark:hover:bg-gray-700'
                        }`}
                    >
                        <item.icon className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default App;