
import { User, ItineraryDay } from './types';

export const CURRENT_USER_ID = 1;

export const USERS: User[] = [
  { id: 1, name: 'You', avatar: 'https://i.pravatar.cc/150?u=1', birthday: '03-15' },
  { id: 2, name: 'Aarav', avatar: 'https://i.pravatar.cc/150?u=2', birthday: '05-20' },
  { id: 3, name: 'Vivaan', avatar: 'https://i.pravatar.cc/150?u=3', birthday: '07-11' },
  { id: 4, name: 'Aditya', avatar: 'https://i.pravatar.cc/150?u=4', birthday: '09-01' },
  { id: 5, name: 'Vihaan', avatar: 'https://i.pravatar.cc/150?u=5', birthday: '11-23' },
  { id: 6, name: 'Arjun', avatar: 'https://i.pravatar.cc/150?u=6', birthday: '01-30' },
  { id: 7, name: 'Sai', avatar: 'https://i.pravatar.cc/150?u=7', birthday: '04-18' },
  { id: 8, name: 'Reyansh', avatar: 'https://i.pravatar.cc/150?u=8', birthday: '06-25' },
  { id: 9, name: 'Krishna', avatar: 'https://i.pravatar.cc/150?u=9', birthday: '08-14' },
  { id: 10, name: 'Ishaan', avatar: 'https://i.pravatar.cc/150?u=10', birthday: '10-05' },
  { id: 11, name: 'Anika', avatar: 'https://i.pravatar.cc/150?u=11', birthday: '12-12' },
  { id: 12, name: 'Diya', avatar: 'https://i.pravatar.cc/150?u=12', birthday: '02-28' },
];

export const ITINERARY: ItineraryDay[] = [
    {
        day: 0,
        date: "2025-11-12",
        title: "Train Journey to Delhi",
        mealPlan: "On your own",
        details: "Board the RAJDHANI EXP (22691) from Secunderabad Jn at 07:15. It's a 22h 15m journey to Hazrat Nizamuddin Delhi.",
        image: "https://picsum.photos/seed/train/800/400"
    },
    {
        day: 1,
        date: "2025-11-13",
        title: "Delhi to Shimla By Cab",
        mealPlan: "No",
        details: "Morning: Pick-up from Delhi (Railway Station/Airport/Hotel). Drive towards Shimla via Karnal, Ambala, Solan. En route: Halt for lunch and scenic photos. Evening: Arrive in Shimla, check-in to hotel. Leisure: Explore Mall Road, Christ Church, and The Ridge (if time permits). Overnight stay: Shimla",
        image: "https://picsum.photos/seed/shimla-road/800/400"
    },
    {
        day: 2,
        date: "2025-11-14",
        title: "Shimla Local Sightseeing + Kufri Excursion",
        mealPlan: "Breakfast & Dinner",
        details: "After breakfast: Visit Kufri Fun World (famous for adventure activities and yak rides), Green Valley View Point, Indira Tourist Park, Himalayan Nature Park. Afternoon: Return to Shimla for local sightseeing - Jakhoo Temple, Scandal Point, Lakkar Bazaar, Tara Devi Temple. Overnight stay: Shimla",
        image: "https://picsum.photos/seed/kufri/800/400"
    },
    {
        day: 3,
        date: "2025-11-15",
        title: "Shimla to Manali (Approx. 8-9 hrs drive)",
        mealPlan: "Breakfast & Dinner",
        details: "Morning: Check-out after breakfast and drive to Manali via scenic Kullu Valley. En route sightseeing: Pandoh Dam, Sundar Nagar Lake, Hanogi Mata Temple, Kullu Shawl Factory. Evening: Arrive in Manali and check-in to hotel. Overnight stay: Manali",
        image: "https://picsum.photos/seed/kullu-valley/800/400"
    },
    {
        day: 4,
        date: "2025-11-16",
        title: "Manali Local City Tour (Full Day Sightseeing)",
        mealPlan: "Breakfast, Lunch & Dinner",
        details: "After breakfast: Explore the beauty of Manali: Hadimba Devi Temple, Vashisht Hot Springs, Manu Temple, Club House, Van Vihar, Tibetan Monastery. Evening: Enjoy shopping and café hopping on Mall Road. Overnight stay: Manali",
        image: "https://picsum.photos/seed/manali-temple/800/400"
    },
    {
        day: 5,
        date: "2025-11-17",
        title: "Manali Atal Tunnel Sissu Village Solang Valley Excursion",
        mealPlan: "Breakfast, Lunch & Dinner",
        details: "After breakfast: Start for a full-day excursion covering: Atal Tunnel - Asia's longest highway tunnel (9.02 km). Sissu Village (Lahaul Valley) - admire waterfalls, glaciers, and snow-clad peaks. Solang Valley - famous for adventure activities like paragliding, zorbing, ropeway ride, skiing (seasonal). Evening: Return to Manali and relax at leisure. Overnight stay: Manali",
        image: "https://picsum.photos/seed/solang-valley/800/400"
    },
    {
        day: 6,
        date: "2025-11-18",
        title: "Manali Manikaran Kasol Manali",
        mealPlan: "Breakfast & Dinner",
        details: "Morning: Drive to Manikaran Sahib - famous for its hot springs and Gurudwara. Proceed to Kasol (Mini Israel of India) – enjoy riverside cafés, local markets, and peaceful walks by the Parvati River. Evening: Return to Manali. Overnight stay: Manali",
        image: "https://picsum.photos/seed/kasol/800/400"
    },
    {
        day: 7,
        date: "2025-11-19",
        title: "Manali Delhi Drop (Approx. 12-13 hrs drive)",
        mealPlan: "Breakfast Only",
        details: "Morning: Check-out after breakfast. Drive back to Delhi with scenic mountain views. Evening/Night: Drop at Delhi (Hotel/Railway Station/Airport).",
        image: "https://picsum.photos/seed/delhi-drop/800/400"
    }
];

export const motivationalQuotes = [
    "Jobs fill your pockets, but adventures fill your soul.",
    "Travel is the only thing you buy that makes you richer.",
    "The world is a book and those who do not travel read only one page.",
    "Adventure is worthwhile.",
    "Travel far enough, you meet yourself.",
];