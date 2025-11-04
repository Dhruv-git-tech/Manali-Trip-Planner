import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Photo, User } from '../types';
import { USERS, CURRENT_USER_ID } from '../constants';
import { PlusCircle, Sparkles } from 'lucide-react';
import { generateCaptionsForImage } from '../utils/gemini';

const PhotoPage: React.FC = () => {
    const [photos, setPhotos] = useLocalStorage<Photo[]>('trip-photos', []);
    const [users] = useLocalStorage<User[]>('trip-users', USERS);
    const [isGenerating, setIsGenerating] = useState(false);
    const [captionChoices, setCaptionChoices] = useState<string[]>([]);
    const [pendingPhotoUrl, setPendingPhotoUrl] = useState<string | null>(null);
    
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsGenerating(true);
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64Url = e.target?.result as string;
                const captions = await generateCaptionsForImage(base64Url, file.type);
                
                setPendingPhotoUrl(base64Url);
                setCaptionChoices(captions);
                setIsGenerating(false);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleCaptionSelect = (caption: string) => {
        if (pendingPhotoUrl) {
            const newPhoto: Photo = {
                id: new Date().toISOString(),
                userId: CURRENT_USER_ID,
                url: pendingPhotoUrl,
                caption: caption,
            };
            setPhotos(prevPhotos => [newPhoto, ...prevPhotos]);
        }
        setPendingPhotoUrl(null);
        setCaptionChoices([]);
    };

    const getUserById = (id: number) => users.find(u => u.id === id);
    
    const CaptionSelectionModal = () => (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
            <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800 m-4">
                <h2 className="mb-4 text-xl font-bold">Choose a Caption</h2>
                {pendingPhotoUrl && <img src={pendingPhotoUrl} alt="Awaiting caption" className="w-full mb-4 rounded-lg aspect-square object-cover" />}
                <div className="space-y-3">
                    {captionChoices.map((caption, index) => (
                        <button
                            key={index}
                            onClick={() => handleCaptionSelect(caption)}
                            className="w-full p-3 text-left bg-gray-100 rounded-lg dark:bg-gray-700 hover:bg-teal-100 dark:hover:bg-teal-800 transition-colors"
                        >
                            "{caption}"
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in">
            {pendingPhotoUrl && <CaptionSelectionModal />}
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div 
                    onClick={() => !isGenerating && document.getElementById('photo-uploader-input')?.click()}
                    className={`flex flex-col items-center justify-center text-gray-500 bg-gray-100 border-2 border-dashed rounded-lg aspect-square ${isGenerating ? 'cursor-wait' : 'cursor-pointer hover:bg-gray-200'} dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700`}
                >
                    {isGenerating ? (
                        <>
                            <Sparkles className="w-12 h-12 mb-2 text-teal-500 animate-spin" />
                            <span className="font-semibold text-center">Generating...</span>
                        </>
                    ) : (
                        <>
                            <PlusCircle className="w-12 h-12 mb-2" />
                            <span className="font-semibold">Add Photo</span>
                        </>
                    )}
                </div>
                {/* Hidden file input */}
                <input
                    type="file"
                    id="photo-uploader-input"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isGenerating}
                />
                {photos.map(photo => {
                    const user = getUserById(photo.userId);
                    return (
                        <div key={photo.id} className="overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
                            <img src={photo.url} alt={photo.caption} className="object-cover w-full aspect-square" />
                            <div className="p-3">
                                <p className="text-sm italic text-gray-700 dark:text-gray-300">"{photo.caption}"</p>
                                <div className="flex items-center justify-end mt-2 space-x-2">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{user?.name}</span>
                                    <img src={user?.avatar} alt={user?.name} className="w-6 h-6 rounded-full"/>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PhotoPage;