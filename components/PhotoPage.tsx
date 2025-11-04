
import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Photo } from '../types';
import { USERS, CURRENT_USER_ID } from '../constants';
import { PlusCircle, Image, User } from 'lucide-react';

const PhotoPage: React.FC = () => {
    const [photos, setPhotos] = useLocalStorage<Photo[]>('trip-photos', []);
    const [showUploader, setShowUploader] = useState(false);
    
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newPhoto: Photo = {
                    id: new Date().toISOString(),
                    userId: CURRENT_USER_ID,
                    url: e.target?.result as string,
                    caption: `A beautiful moment captured by ${USERS.find(u => u.id === CURRENT_USER_ID)?.name}`
                };
                setPhotos([newPhoto, ...photos]);
                setShowUploader(false);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const getUserById = (id: number) => USERS.find(u => u.id === id);

    return (
        <div className="animate-fade-in">
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div 
                    onClick={() => setShowUploader(true)}
                    className="flex flex-col items-center justify-center text-gray-500 bg-gray-100 border-2 border-dashed rounded-lg cursor-pointer aspect-square hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                    <PlusCircle className="w-12 h-12 mb-2" />
                    <span className="font-semibold">Add Photo</span>
                </div>
                {photos.map(photo => {
                    const user = getUserById(photo.userId);
                    return (
                        <div key={photo.id} className="relative overflow-hidden rounded-lg shadow-md group aspect-square">
                            <img src={photo.url} alt={photo.caption} className="object-cover w-full h-full" />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-2 text-white transition-transform duration-300 translate-y-full bg-gradient-to-t from-black to-transparent group-hover:translate-y-0">
                                <div className="flex items-center space-x-2">
                                    <img src={user?.avatar} alt={user?.name} className="w-6 h-6 border-2 border-white rounded-full"/>
                                    <span className="text-sm font-semibold">{user?.name}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showUploader && (
                <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowUploader(false)}>
                    <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800 m-4" onClick={(e) => e.stopPropagation()}>
                        <h2 className="mb-4 text-xl font-bold">Upload a Photo</h2>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                         <button onClick={() => setShowUploader(false)} className="w-full px-4 py-2 mt-4 text-gray-700 bg-gray-200 rounded-lg dark:text-gray-200 dark:bg-gray-600">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotoPage;
