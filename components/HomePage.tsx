import React, { useEffect, useState } from 'react';
import { ITINERARY } from '../constants';
import { ItineraryDay } from '../types';
import { MapPin, Sun, Moon, Calendar, Train, TrendingUp } from 'lucide-react';

const HomePage: React.FC = () => {
    const [todayPlan, setTodayPlan] = useState<ItineraryDay | null>(null);
    const [tripStarted, setTripStarted] = useState(false);
    const [daysUntilTrip, setDaysUntilTrip] = useState(0);
    const [progress, setProgress] = useState({ completed: 0, total: ITINERARY.length });


    useEffect(() => {
        const today = new Date();
        // For testing, uncomment below and set a date during the trip
        // const today = new Date("2025-11-16T10:00:00Z"); 
        
        today.setHours(0, 0, 0, 0);

        const tripStartDate = new Date(ITINERARY[0].date);
        tripStartDate.setHours(0, 0, 0, 0);

        // Calculate progress
        const completedDays = ITINERARY.filter(day => new Date(day.date) < today).length;
        setProgress({ completed: completedDays, total: ITINERARY.length });

        if (today < tripStartDate) {
            const diffTime = Math.abs(tripStartDate.getTime() - today.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysUntilTrip(diffDays);
            setTripStarted(false);
        } else {
            setTripStarted(true);
            const currentDayPlan = ITINERARY.find(day => {
                const dayDate = new Date(day.date);
                dayDate.setHours(0, 0, 0, 0);
                return dayDate.getTime() === today.getTime();
            });
            setTodayPlan(currentDayPlan || null);
        }
    }, []);

    const WelcomeCard = () => (
        <div className="p-6 mb-6 text-white bg-teal-500 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold">Hello, Travellers!</h1>
            <p className="mt-2 text-teal-100">Welcome to your Manali adventure dashboard.</p>
        </div>
    );

    const CountdownCard = () => (
        <div className="p-6 mb-6 text-center bg-white rounded-xl shadow-lg dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Trip starts in:</h2>
            <div className="my-2 text-5xl font-bold text-teal-600 dark:text-teal-400">{daysUntilTrip}</div>
            <p className="text-gray-500 dark:text-gray-400">days!</p>
        </div>
    );

    const ProgressCard = ({ completed, total }: { completed: number, total: number }) => {
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        return (
            <div className="p-6 bg-white rounded-xl shadow-lg dark:bg-gray-800">
                <h2 className="flex items-center mb-3 text-xl font-bold text-gray-800 dark:text-white">
                    <TrendingUp className="w-6 h-6 mr-3 text-teal-500" />
                    Trip Progress
                </h2>
                <div className="flex items-center justify-between mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                    <span>{completed} / {total} days completed</span>
                    <span>{Math.round(percentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <WelcomeCard />
            {!tripStarted ? <CountdownCard /> : <ProgressCard completed={progress.completed} total={progress.total} />}

            <div className="p-6 bg-white rounded-xl shadow-lg dark:bg-gray-800">
                <h2 className="flex items-center mb-4 text-xl font-bold text-gray-800 dark:text-white">
                    <Train className="w-6 h-6 mr-3 text-teal-500"/>
                    Transport Details
                </h2>
                <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                    <p className="font-semibold">Train: RAJDHANI EXP (22691)</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Secunderabad Jn to Hazrat Nizamuddin Delhi</p>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300"><span className="font-semibold">Departure:</span> 12 Nov 2025, 07:15</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-semibold">Arrival:</span> 13 Nov 2025, 05:30</p>
                </div>
            </div>

            {tripStarted && todayPlan && (
                <div className="bg-white rounded-xl shadow-lg dark:bg-gray-800 overflow-hidden">
                    <img src={todayPlan.image} alt={todayPlan.title} className="object-cover w-full h-48" />
                    <div className="p-6">
                        <p className="text-sm font-medium text-teal-500 dark:text-teal-400">Day {todayPlan.day} &bull; {new Date(todayPlan.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">{todayPlan.title}</h2>
                        
                        <div className="mt-4 space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Meal Plan:</h3>
                                <p className="text-gray-600 dark:text-gray-400">{todayPlan.mealPlan}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Today's Adventure:</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{todayPlan.details}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {tripStarted && !todayPlan && (
                 <div className="p-6 text-center bg-white rounded-xl shadow-lg dark:bg-gray-800">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">No scheduled activities for today.</h2>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Enjoy your free day or check the planner for ideas!</p>
                </div>
            )}
        </div>
    );
};

export default HomePage;