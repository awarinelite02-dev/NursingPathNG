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
  async signUp(email, password, userData) {
    try {
      let user;

      // Only create with email/password if password is provided
      if (password) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        await updateProfile(user, { displayName: userData.name });
      } else {
        // Called after Google sign-in — user already exists in auth
        user = auth.currentUser;
        if (!user) throw new Error('No authenticated user found');
      }

      // Create Firestore document
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: userData.name || user.displayName || '',
        phone: userData.phone || '',
        role: userData.role || 'student',
        school_id: userData.school_id || null,
        target_school: userData.target_school || null,
        avatar_url: user.photoURL || '',
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

  async signIn(email, password) {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async signOut() {
    try {
      return await signOut(auth);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  getCurrentUser() {
    return auth.currentUser;
  }

  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }

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

  async updateUserData(uid, data) {
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, { ...data, updated_at: new Date() });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addXP(uid, xpAmount) {
    try {
      const userData = await this.getUserData(uid);
      const newXP = (userData.xp || 0) + xpAmount;
      let newTier = 'bronze';
      if (newXP >= 3500) newTier = 'diamond';
      else if (newXP >= 1500) newTier = 'gold';
      else if (newXP >= 500) newTier = 'silver';
      await updateDoc(doc(db, 'users', uid), { xp: newXP, tier: newTier, updated_at: new Date() });
      return { xp: newXP, tier: newTier };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async awardBadge(uid, badge) {
    try {
      const userData = await this.getUserData(uid);
      const badges = userData.badges || [];
      if (!badges.includes(badge)) {
        await updateDoc(doc(db, 'users', uid), { badges: [...badges, badge], updated_at: new Date() });
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateDailyStreak(uid) {
    try {
      const userData = await this.getUserData(uid);
      const today = new Date().toDateString();
      const lastStudy = userData.last_study_date?.toDate?.().toDateString?.();
      let newStreak = userData.daily_streak || 0;
      if (lastStudy !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        newStreak = lastStudy === yesterday.toDateString() ? newStreak + 1 : 1;
        await updateDoc(doc(db, 'users', uid), { daily_streak: newStreak, last_study_date: new Date(), updated_at: new Date() });
        return newStreak;
      }
      return newStreak;
    } catch (error) {
      throw new Error(error.message);
    }
  }

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
