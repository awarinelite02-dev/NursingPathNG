import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import authService from '../services/authService';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      try {
        if (authUser) {
          setUser(authUser);
          // Retry fetching user data a few times — doc may not exist yet right after signup
          let data = null;
          for (let i = 0; i < 5; i++) {
            data = await authService.getUserData(authUser.uid);
            if (data) break;
            await new Promise(res => setTimeout(res, 500));
          }
          // If still no doc (e.g. Google sign-in first time), create a default one
          if (!data) {
            await authService.signUp(authUser.email, null, {
              name: authUser.displayName || authUser.email.split('@')[0],
              role: 'student',
              uid: authUser.uid,
            }).catch(() => {});
            data = await authService.getUserData(authUser.uid).catch(() => ({
              uid: authUser.uid,
              email: authUser.email,
              name: authUser.displayName || '',
              role: 'student',
            }));
          }
          setUserData(data);
        } else {
          setUser(null);
          setUserData(null);
        }
      } catch (err) {
        setError(err.message);
        // Don't block loading even on error
        setUser(authUser);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signUp = async (email, password, userData) => {
    try {
      setError(null);
      const newUser = await authService.signUp(email, password, userData);
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signIn = async (email, password) => {
    try {
      setError(null);
      const user = await authService.signIn(email, password);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await authService.signOut();
      setUser(null);
      setUserData(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateUser = async (data) => {
    try {
      setError(null);
      if (user) {
        await authService.updateUserData(user.uid, data);
        const updated = await authService.getUserData(user.uid);
        setUserData(updated);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    userData,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: userData?.role === 'admin',
    signUp,
    signIn,
    signOut,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
