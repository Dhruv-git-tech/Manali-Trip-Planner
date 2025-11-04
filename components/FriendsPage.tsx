
import React, { useMemo } from 'react';
import { USERS } from '../constants';
import { User } from '../types';
import { Cake, Gift } from 'lucide-react';

const FriendsPage: React.FC = () => {

    const sortedFriends = useMemo(() => {
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentDate = today.getDate();

        return [...USERS].sort((a, b) => {
            const [aMonth, aDay] = a.birthday.split('-').map(Number);
            const [bMonth, bDay] = b.birthday.split('-').map(Number);

            const aHasPassed = aMonth < currentMonth || (aMonth === currentMonth && aDay < currentDate);
            const bHasPassed = bMonth < currentMonth || (bMonth === currentMonth && bDay < currentDate);

            if (aHasPassed && !bHasPassed) return 1;
            if (!aHasPassed && bHasPassed) return -1;
            
            if (aMonth !== bMonth) return aMonth - bMonth;
            return aDay - bDay;
        });
    }, []);

    const isBirthdayToday = (birthday: string) => {
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentDate = today.getDate();
        const [month, day] = birthday.split('-').map(Number);
        return month === currentMonth && day === currentDate;
    };


    return (
        <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold">The Crew ({USERS.length})</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {sortedFriends.map(user => {
                    const birthday = new Date(`2000-${user.birthday}`).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
                    const isToday = isBirthdayToday(user.birthday);

                    return (
                        <div key={user.id} className={`p-4 text-center bg-white rounded-lg shadow-md dark:bg-gray-800 ${isToday ? 'border-2 border-yellow-400' : ''}`}>
                            <img src={user.avatar} alt={user.name} className="w-20 h-20 mx-auto rounded-full" />
                            <p className="mt-2 font-semibold">{user.name}</p>
                            <div className="flex items-center justify-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                                <Cake size={14} className="mr-1" />
                                <span>{birthday}</span>
                            </div>
                            {isToday && (
                                <div className="flex items-center justify-center p-1 mt-2 text-xs font-bold text-yellow-800 bg-yellow-200 rounded-full">
                                    <Gift size={12} className="mr-1"/>
                                    Birthday Today!
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default FriendsPage;
