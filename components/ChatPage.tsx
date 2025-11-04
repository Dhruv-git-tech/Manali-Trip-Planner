import React, { useState, useRef, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Message, User } from '../types';
import { USERS, CURRENT_USER_ID } from '../constants';
import { ArrowLeft, Send } from 'lucide-react';

const ChatPage: React.FC = () => {
    const [messages, setMessages] = useLocalStorage<Message[]>('trip-messages', []);
    const [users] = useLocalStorage<User[]>('trip-users', USERS);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const currentUser = users.find(u => u.id === CURRENT_USER_ID)!;
    const friends = users.filter(u => u.id !== CURRENT_USER_ID);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, selectedUserId]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && selectedUserId) {
            const message: Message = {
                id: new Date().toISOString(),
                senderId: CURRENT_USER_ID,
                receiverId: selectedUserId,
                text: newMessage,
                timestamp: Date.now(),
            };
            setMessages([...messages, message]);
            setNewMessage('');
        }
    };
    
    if (selectedUserId) {
        const selectedUser = users.find(u => u.id === selectedUserId)!;
        const chatMessages = messages.filter(
            m => (m.senderId === CURRENT_USER_ID && m.receiverId === selectedUserId) ||
                 (m.senderId === selectedUserId && m.receiverId === CURRENT_USER_ID)
        ).sort((a, b) => a.timestamp - b.timestamp);

        return (
            <div className="flex flex-col h-[calc(100vh-8rem)] bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="flex items-center p-3 border-b dark:border-gray-700">
                    <button onClick={() => setSelectedUserId(null)} className="mr-3 text-gray-600 dark:text-gray-300"><ArrowLeft /></button>
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 mr-3 rounded-full" />
                    <h2 className="font-bold">{selectedUser.name}</h2>
                </div>
                <div className="flex-grow p-4 overflow-y-auto">
                    <div className="space-y-4">
                        {chatMessages.map(msg => (
                            <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === CURRENT_USER_ID ? 'justify-end' : 'justify-start'}`}>
                                {msg.senderId !== CURRENT_USER_ID && <img src={selectedUser.avatar} alt={selectedUser.name} className="w-6 h-6 rounded-full"/>}
                                <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.senderId === CURRENT_USER_ID ? 'bg-teal-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 rounded-bl-none'}`}>
                                    <p>{msg.text}</p>
                                </div>
                                {msg.senderId === CURRENT_USER_ID && <img src={currentUser.avatar} alt={currentUser.name} className="w-6 h-6 rounded-full"/>}
                            </div>
                        ))}
                    </div>
                     <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="flex p-3 border-t dark:border-gray-700">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-grow p-2 bg-gray-100 border-none rounded-l-full dark:bg-gray-700 focus:ring-0"
                    />
                    <button type="submit" className="p-3 text-white bg-teal-500 rounded-r-full"><Send /></button>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-3 animate-fade-in">
             <h2 className="mb-4 text-xl font-bold">Secret Chat</h2>
            {friends.map(user => (
                <div key={user.id} onClick={() => setSelectedUserId(user.id)} className="flex items-center p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <img src={user.avatar} alt={user.name} className="w-12 h-12 mr-4 rounded-full" />
                    <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Tap to chat</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChatPage;