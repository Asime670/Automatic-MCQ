import { storageService } from './storageService.js';
import { STORAGE_KEYS, ROLES } from '../utils/constants.js';
import { initialUsers } from '../data/sampleData.js';

export const authService = {
  initUsers: () => {
    if (!storageService.get(STORAGE_KEYS.USERS)) {
      storageService.set(STORAGE_KEYS.USERS, initialUsers);
    }
  },
  login: async (email, password) => {
    const users = storageService.get(STORAGE_KEYS.USERS) || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password');
    return user;
  },
  register: async (name, email, password, isAdmin = false) => {
    const users = storageService.get(STORAGE_KEYS.USERS) || [];
    if (users.find(u => u.email === email)) throw new Error('Email already exists');
    const role = isAdmin ? ROLES.ADMIN : ROLES.STUDENT;
    const newUser = { id: Date.now().toString(), name, email, password, role };
    storageService.set(STORAGE_KEYS.USERS, [...users, newUser]);
    return newUser;
  }
};