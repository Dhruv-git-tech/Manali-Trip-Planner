import React, { useState, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Expense, ExpenseCategory } from '../types';
import { USERS, CURRENT_USER_ID } from '../constants';
import { Plus, Trash2, ArrowUpDown, Layers } from 'lucide-react';

const categoryStyles: { [key in ExpenseCategory]: string } = {
    Food: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Travel: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Accommodation: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Activities: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Other: 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200',
};

const categoryBarColors: { [key in ExpenseCategory]: string } = {
    Food: 'bg-red-500',
    Travel: 'bg-blue-500',
    Accommodation: 'bg-yellow-500',
    Activities: 'bg-green-500',
    Other: 'bg-gray-500',
};


const ExpensePage: React.FC = () => {
    const [expenses, setExpenses] = useLocalStorage<Expense[]>('trip-expenses', []);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState<ExpenseCategory>('Food');
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState<'personal' | 'group'>('personal');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

    const categories: ExpenseCategory[] = ['Food', 'Travel', 'Accommodation', 'Activities', 'Other'];

    const addExpense = (e: React.FormEvent) => {
        e.preventDefault();
        if (description && amount) {
            const newExpense: Expense = {
                id: new Date().toISOString(),
                userId: CURRENT_USER_ID,
                description,
                amount: parseFloat(amount),
                date: new Date().toISOString(),
                category,
            };
            setExpenses([...expenses, newExpense]);
            setDescription('');
            setAmount('');
            setShowForm(false);
            setCategory('Food');
        }
    };
    
    const removeExpense = (id: string) => {
        setExpenses(expenses.filter(exp => exp.id !== id && exp.userId === CURRENT_USER_ID));
    };

    const myExpenses = useMemo(() => expenses.filter(e => e.userId === CURRENT_USER_ID), [expenses]);
    
    const sortedMyExpenses = useMemo(() => 
        [...myExpenses].sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            }
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        }), 
        [myExpenses, sortBy]
    );

    const sortedGroupExpenses = useMemo(() =>
        [...expenses].sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            }
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        }),
        [expenses, sortBy]
    );

    const totalMyExpenses = useMemo(() => myExpenses.reduce((sum, e) => sum + e.amount, 0), [myExpenses]);
    const totalGroupExpense = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
    
    const myCategorySummary = useMemo(() => {
        return myExpenses.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
            return acc;
        }, {} as Record<ExpenseCategory, number>);
    }, [myExpenses]);

    const groupCategorySummary = useMemo(() => {
        return expenses.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
            return acc;
        }, {} as Record<ExpenseCategory, number>);
    }, [expenses]);


    const getUserById = (id: number) => USERS.find(u => u.id === id);

    const CategorySummary = ({ summary, total }: { summary: Record<ExpenseCategory, number>; total: number }) => {
        if (total === 0) {
            return (
                 <div className="p-4 mb-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                    <h3 className="flex items-center mb-3 font-semibold text-md">
                        <Layers size={18} className="mr-2 text-gray-500" />
                        Spending Breakdown
                    </h3>
                    <p className="py-4 text-sm text-center text-gray-500">No expenses logged yet to show a chart.</p>
                </div>
            );
        }
        
        return (
            <div className="p-4 mb-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                <h3 className="flex items-center mb-4 font-semibold text-md">
                    <Layers size={18} className="mr-2 text-gray-500" />
                    Spending Breakdown
                </h3>
                <div className="space-y-4">
                    {Object.entries(summary).sort(([,a], [,b]) => b - a).map(([cat, catTotal]) => {
                        const percentage = total > 0 ? (catTotal / total) * 100 : 0;
                        return (
                            <div key={cat}>
                                <div className="flex justify-between mb-1 text-sm font-medium">
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">{cat}</span>
                                    <span className="text-gray-600 dark:text-gray-400">₹{catTotal.toFixed(2)}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div
                                        className={`h-2.5 rounded-full ${categoryBarColors[cat as ExpenseCategory]}`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const SortButton = () => (
        <div className="flex justify-end mb-4">
            <button
                onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
                className="flex items-center px-3 py-1 text-sm font-medium text-gray-600 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
                <ArrowUpDown size={14} className="mr-2" />
                Sort: {sortBy === 'newest' ? 'Newest First' : 'Oldest First'}
            </button>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <div className="flex p-1 mb-6 bg-gray-200 rounded-lg dark:bg-gray-700">
                <button onClick={() => setActiveTab('personal')} className={`w-1/2 p-2 font-semibold rounded-md transition-colors ${activeTab === 'personal' ? 'bg-white text-teal-600 dark:bg-gray-800' : 'text-gray-600 dark:text-gray-300'}`}>My Expenses</button>
                <button onClick={() => setActiveTab('group')} className={`w-1/2 p-2 font-semibold rounded-md transition-colors ${activeTab === 'group' ? 'bg-white text-teal-600 dark:bg-gray-800' : 'text-gray-600 dark:text-gray-300'}`}>Group Expenses</button>
            </div>

            {activeTab === 'personal' && (
                <div>
                    <div className="p-4 mb-4 text-center bg-teal-100 rounded-lg dark:bg-teal-900">
                        <p className="text-sm text-teal-800 dark:text-teal-200">Your Total Spending</p>
                        <p className="text-3xl font-bold text-teal-800 dark:text-teal-200">₹{totalMyExpenses.toFixed(2)}</p>
                    </div>
                    <CategorySummary summary={myCategorySummary} total={totalMyExpenses} />
                    <SortButton />
                    <ul className="space-y-3">
                        {sortedMyExpenses.map(exp => (
                            <li key={exp.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                                <div>
                                    <p className="font-semibold">{exp.description}</p>
                                    <div className="flex items-center mt-1 space-x-2">
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryStyles[exp.category]}`}>
                                            {exp.category}
                                        </span>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(exp.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <p className="font-bold text-lg">₹{exp.amount.toFixed(2)}</p>
                                  <button onClick={() => removeExpense(exp.id)} className="text-red-500 hover:text-red-700">
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === 'group' && (
                <div>
                    <div className="p-4 mb-4 text-center bg-orange-100 rounded-lg dark:bg-orange-900">
                        <p className="text-sm text-orange-800 dark:text-orange-200">Total Group Spending</p>
                        <p className="text-3xl font-bold text-orange-800 dark:text-orange-200">₹{totalGroupExpense.toFixed(2)}</p>
                    </div>
                    <CategorySummary summary={groupCategorySummary} total={totalGroupExpense} />
                    <SortButton />
                     <ul className="space-y-3">
                        {sortedGroupExpenses.map(exp => {
                            const user = getUserById(exp.userId);
                            return (
                                <li key={exp.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                                    <div className="flex items-center">
                                        <img src={user?.avatar} alt={user?.name} className="w-10 h-10 mr-4 rounded-full" />
                                        <div>
                                            <p className="font-semibold">{exp.description}</p>
                                            <div className="flex items-center mt-1 space-x-2">
                                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryStyles[exp.category]}`}>
                                                    {exp.category}
                                                </span>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">by {user?.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="font-bold text-lg">₹{exp.amount.toFixed(2)}</p>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
            
            <button
                onClick={() => setShowForm(!showForm)}
                className="fixed z-20 flex items-center justify-center w-16 h-16 text-white bg-teal-500 rounded-full shadow-lg bottom-24 right-4 hover:bg-teal-600"
            >
                <Plus size={32} />
            </button>

            {showForm && (
                <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800 m-4">
                        <h2 className="mb-4 text-xl font-bold">Add New Expense</h2>
                        <form onSubmit={addExpense}>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Expense Description"
                                className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600"
                                required
                            />
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Amount"
                                className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600"
                                required
                            />
                             <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                                className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600"
                                required
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg dark:text-gray-200 dark:bg-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-white bg-teal-500 rounded-lg">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpensePage;