import React, { createContext, useContext, useState } from 'react';
import { storageService } from '../services/storageService.js';
import { STORAGE_KEYS } from '../utils/constants.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(storageService.get(STORAGE_KEYS.CURRENT_USER));

  const login = (userData) => {
    setUser(userData);
    storageService.set(STORAGE_KEYS.CURRENT_USER, userData);
  };

  const logout = () => {
    setUser(null);
    storageService.remove(STORAGE_KEYS.CURRENT_USER);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);