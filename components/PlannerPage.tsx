import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Todo, Place } from '../types';
import { Plus, Trash, Check, Coffee, MapPin, Map, Navigation, Sparkles } from 'lucide-react';
import GeminiInfoCard from './GeminiInfoCard';

const PlannerPage: React.FC = () => {
    const [todos, setTodos] = useLocalStorage<Todo[]>('trip-todos', []);
    const [places, setPlaces] = useLocalStorage<Place[]>('trip-places', [
        { id: '1', name: 'Johnson\'s Cafe', category: 'cafe', visited: false, lat: 32.2427, lng: 77.1890 },
        { id: '2', name: 'Cafe 1947', category: 'cafe', visited: false, lat: 32.2618, lng: 77.1877 },
        { id: '3', name: 'Hadimba Temple', category: 'place', visited: true, lat: 32.2445, lng: 77.1816 },
        { id: '4', name: 'Solang Valley', category: 'place', visited: false, lat: 32.3167, lng: 77.1667 },
    ]);
    const [newTodo, setNewTodo] = useState('');
    const [newPlace, setNewPlace] = useState('');
    const [newPlaceCategory, setNewPlaceCategory] = useState<'cafe' | 'place'>('place');
    const [showMap, setShowMap] = useState(false);
    const [infoPlaceId, setInfoPlaceId] = useState<string | null>(null);

    const addTodo = () => {
        if (newTodo.trim()) {
            setTodos([...todos, { id: Date.now().toString(), text: newTodo, completed: false }]);
            setNewTodo('');
        }
    };
    
    const addPlace = () => {
        if (newPlace.trim()) {
            setPlaces([...places, { id: Date.now().toString(), name: newPlace, category: newPlaceCategory, visited: false }]);
            setNewPlace('');
        }
    };

    const toggleTodo = (id: string) => {
        setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    };
    
    const togglePlaceVisited = (id: string) => {
        setPlaces(places.map(place => place.id === id ? { ...place, visited: !place.visited } : place));
    };

    const removeTodo = (id: string) => setTodos(todos.filter(todo => todo.id !== id));
    const removePlace = (id: string) => setPlaces(places.filter(place => place.id !== id));

    const handleToggleInfo = (id: string) => setInfoPlaceId(currentId => (currentId === id ? null : id));

    const handleInfoFetched = (id: string, description: string, sources: Place['sources']) => {
        setPlaces(places.map(p => p.id === id ? { ...p, description, sources } : p));
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Must Visit Places & Cafes</h2>
                    <button 
                        onClick={() => setShowMap(!showMap)} 
                        className={`p-2 rounded-full transition-colors ${showMap ? 'bg-teal-100 text-teal-600 dark:bg-teal-900' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        aria-label="Toggle map view"
                    ><Map size={20} /></button>
                </div>
                
                {showMap && (
                    <div className="mb-4 h-64 overflow-hidden rounded-lg shadow-md">
                        <iframe
                            src="https://maps.google.com/maps?q=Manali&t=&z=13&ie=UTF8&iwloc=&output=embed"
                            width="100%" height="100%" style={{ border: 0 }}
                            allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                            title="Map of Manali"
                        ></iframe>
                    </div>
                )}

                <div className="space-y-2">
                    {places.map(place => (
                        <div key={place.id}>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                                <div className="flex items-center flex-grow min-w-0">
                                    <button onClick={() => togglePlaceVisited(place.id)} className={`flex-shrink-0 mr-3 p-1 rounded-full ${place.visited ? 'bg-green-500 text-white' : 'border border-gray-400'}`}>
                                        <Check size={14} />
                                    </button>
                                    {place.category === 'cafe' ? <Coffee className="flex-shrink-0 w-5 h-5 mr-2 text-yellow-600" /> : <MapPin className="flex-shrink-0 w-5 h-5 mr-2 text-red-500" />}
                                    <span className={`truncate ${place.visited ? 'line-through text-gray-500' : ''}`}>{place.name}</span>
                                </div>
                                <div className="flex items-center flex-shrink-0 ml-2 space-x-2">
                                     <button onClick={() => handleToggleInfo(place.id)} className={`text-gray-400 hover:text-yellow-500 transition-colors ${infoPlaceId === place.id ? 'text-yellow-500' : ''}`} aria-label={`Get info about ${place.name}`}>
                                        <Sparkles size={18} />
                                    </button>
                                    {place.lat && place.lng && (
                                        <a href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-500" aria-label={`Get directions to ${place.name}`}>
                                            <Navigation size={16} />
                                        </a>
                                    )}
                                    <button onClick={() => removePlace(place.id)} className="text-gray-400 hover:text-red-500"><Trash size={16} /></button>
                                </div>
                            </div>
                             {infoPlaceId === place.id && (
                                <GeminiInfoCard
                                    placeName={place.name}
                                    onFetched={(desc, sources) => handleInfoFetched(place.id, desc, sources)}
                                    cachedDescription={place.description}
                                    cachedSources={place.sources}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex mt-4 space-x-2">
                    <input type="text" value={newPlace} onChange={e => setNewPlace(e.target.value)} placeholder="Add a place..." className="flex-grow p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    <select value={newPlaceCategory} onChange={e => setNewPlaceCategory(e.target.value as any)} className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                        <option value="place">Place</option>
                        <option value="cafe">Cafe</option>
                    </select>
                    <button onClick={addPlace} className="p-2 text-white bg-teal-500 rounded-md"><Plus size={20} /></button>
                </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-bold">Shared To-Do List</h2>
                <div className="space-y-2">
                    {todos.map(todo => (
                        <div key={todo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                            <div className="flex items-center">
                                <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} className="w-5 h-5 mr-3 rounded text-teal-600 focus:ring-teal-500" />
                                <span className={todo.completed ? 'line-through text-gray-500' : ''}>{todo.text}</span>
                            </div>
                            <button onClick={() => removeTodo(todo.id)} className="text-gray-400 hover:text-red-500"><Trash size={16} /></button>
                        </div>
                    ))}
                </div>
                <div className="flex mt-4">
                    <input type="text" value={newTodo} onChange={e => setNewTodo(e.target.value)} placeholder="Add a to-do..." className="flex-grow p-2 border rounded-l-md dark:bg-gray-700 dark:border-gray-600" />
                    <button onClick={addTodo} className="p-2 text-white bg-teal-500 rounded-r-md"><Plus size={20} /></button>
                </div>
            </div>
        </div>
    );
};

export default PlannerPage;