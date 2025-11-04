export interface User {
  id: number;
  name: string;
  avatar: string;
  birthday: string; // MM-DD format
}

export interface ItineraryDay {
  day: number;
  date: string; // YYYY-MM-DD
  title: string;
  mealPlan: string;
  details: string;
  image: string;
  city: 'Delhi' | 'Shimla' | 'Manali';
}

export type ExpenseCategory = 'Food' | 'Travel' | 'Accommodation' | 'Activities' | 'Other';

export interface Expense {
  id: string;
  userId: number;
  description: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
}

export interface Photo {
  id: string;
  userId: number;
  url: string;
  caption: string;
}

export interface Message {
  id: string;
  senderId: number;
  receiverId: number;
  text: string;
  timestamp: number;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export interface Place {
  id: string;
  name: string;
  category: 'cafe' | 'place';
  visited: boolean;
  lat?: number;
  lng?: number;
  description?: string;
  sources?: { 
    uri: string; 
    title: string; 
    type: 'web' | 'map'; 
  }[];
}