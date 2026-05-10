import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { auth, db } from './firebase';

class AuthService {
  // Sign up new user
  async signUp(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile
      await updateProfile(user, {
        displayName: userData.name,
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: userData.name,
        phone: userData.phone || '',
        role: userData.role || 'student', // 'student' or 'admin'
        school_id: userData.school_id || null,
        target_school: userData.target_school || null,
        avatar_url: '',
        xp: 0,
        badges: [],
        tier: 'bronze',
        daily_streak: 0,
        last_study_date: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Sign in user
  async signIn(email, password) {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Sign out user
  async signOut() {
    try {
      return await signOut(auth);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // Get user data from Firestore
  async getUserData(uid) {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Update user data
  async updateUserData(uid, data) {
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, {
        ...data,
        updated_at: new Date(),
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Update user XP and check for tier upgrade
  async addXP(uid, xpAmount) {
    try {
      const userData = await this.getUserData(uid);
      const newXP = (userData.xp || 0) + xpAmount;
      
      // Tier calculation: 0-500 Bronze, 500-1500 Silver, 1500-3500 Gold, 3500+ Diamond
      let newTier = 'bronze';
      if (newXP >= 3500) newTier = 'diamond';
      else if (newXP >= 1500) newTier = 'gold';
      else if (newXP >= 500) newTier = 'silver';

      await updateDoc(doc(db, 'users', uid), {
        xp: newXP,
        tier: newTier,
        updated_at: new Date(),
      });

      return { xp: newXP, tier: newTier };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Award badge
  async awardBadge(uid, badge) {
    try {
      const userData = await this.getUserData(uid);
      const badges = userData.badges || [];
      
      if (!badges.includes(badge)) {
        await updateDoc(doc(db, 'users', uid), {
          badges: [...badges, badge],
          updated_at: new Date(),
        });
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Update daily streak
  async updateDailyStreak(uid) {
    try {
      const userData = await this.getUserData(uid);
      const today = new Date().toDateString();
      const lastStudy = userData.last_study_date?.toDate?.().toDateString?.();

      let newStreak = userData.daily_streak || 0;
      
      if (lastStudy !== today) {
        // Check if streak should continue or reset
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastStudy === yesterday.toDateString()) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }

        await updateDoc(doc(db, 'users', uid), {
          daily_streak: newStreak,
          last_study_date: new Date(),
          updated_at: new Date(),
        });

        return newStreak;
      }
      
      return newStreak;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get leaderboard for school
  async getSchoolLeaderboard(schoolId) {
    try {
      const q = query(
        collection(db, 'users'),
        where('school_id', '==', schoolId),
        where('role', '==', 'student')
      );
      
      const querySnapshot = await getDocs(q);
      const students = [];
      
      querySnapshot.forEach((doc) => {
        students.push({
          uid: doc.id,
          ...doc.data(),
        });
      });

      // Sort by XP descending
      return students.sort((a, b) => (b.xp || 0) - (a.xp || 0));
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Check if user is admin
  async isAdmin(uid) {
    try {
      const userData = await this.getUserData(uid);
      return userData?.role === 'admin';
    } catch (error) {
      return false;
    }
  }
}

export default new AuthService();
