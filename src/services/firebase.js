import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence
} from 'firebase/auth';
import { 
  getFirestore
} from 'firebase/firestore';
import { 
  getStorage
} from 'firebase/storage';
import { 
  getDatabase
} from 'firebase/database';
import { 
  getMessaging, 
  getToken, 
  onMessage 
} from 'firebase/messaging';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
};

// Validate that all required env vars are present
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID',
];

const missingVars = requiredEnvVars.filter(
  varName => !process.env[varName]
);

if (missingVars.length > 0) {
  console.warn('⚠️  Missing Firebase environment variables:', missingVars);
  console.warn('Please check your .env file');
}

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Firebase:', error);
  throw error;
}

// Initialize Auth
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.warn('⚠️  Persistence error:', error);
});

// Initialize Firestore Database (Cloud Firestore)
export const db = getFirestore(app);

// Initialize Realtime Database (if using)
export const realtimeDb = getDatabase(app);

// Initialize Storage
export const storage = getStorage(app);

// Initialize Messaging for notifications (optional)
let messaging;
try {
  messaging = getMessaging(app);
  console.log('✅ Firebase Messaging initialized');
} catch (error) {
  console.warn('⚠️  Firebase Messaging not available:', error.message);
}

export { messaging };

// Request notification permission
export const requestNotificationPermission = async () => {
  try {
    if (!messaging) {
      console.warn('Messaging not initialized');
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_VAPID_KEY,
    });
    if (token) {
      console.log('✅ FCM Token obtained');
      return token;
    }
  } catch (error) {
    console.log('⚠️  Notification permission request failed:', error.message);
    return null;
  }
};

// Listen for foreground messages
export const listenForMessages = (callback) => {
  if (!messaging) {
    console.warn('Messaging not initialized');
    return;
  }

  onMessage(messaging, (payload) => {
    console.log('📬 Message received:', payload);
    callback(payload);
  });
};

export default app;
