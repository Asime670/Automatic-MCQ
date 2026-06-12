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
  register: async (name, email, password, requestAdmin = false) => {
    const users = storageService.get(STORAGE_KEYS.USERS) || [];
    if (users.find(u => u.email === email)) throw new Error('Email already exists');
    
    let role = ROLES.STUDENT;
    let isPendingAdmin = false;

    if (requestAdmin) {
      const hasAdmin = users.some(u => u.role === ROLES.ADMIN);
      if (!hasAdmin) {
        role = ROLES.ADMIN;
      } else {
        isPendingAdmin = true;
      }
    }

    const newUser = { id: Date.now().toString(), name, email, password, role, isPendingAdmin };
    storageService.set(STORAGE_KEYS.USERS, [...users, newUser]);
    return newUser;
  },
  getPendingAdmins: () => {
    const users = storageService.get(STORAGE_KEYS.USERS) || [];
    return users.filter(u => u.isPendingAdmin);
  },
  approveAdmin: (userId) => {
    const users = storageService.get(STORAGE_KEYS.USERS) || [];
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, role: ROLES.ADMIN, isPendingAdmin: false } : u
    );
    storageService.set(STORAGE_KEYS.USERS, updatedUsers);
  },
  rejectAdmin: (userId) => {
    const users = storageService.get(STORAGE_KEYS.USERS) || [];
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, isPendingAdmin: false } : u
    );
    storageService.set(STORAGE_KEYS.USERS, updatedUsers);
  }
};