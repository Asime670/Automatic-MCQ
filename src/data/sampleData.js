import { ROLES } from '../utils/constants.js';
export const initialUsers = [
  { id: '1', name: 'Admin', email: 'admin@test.com', password: 'password', role: ROLES.ADMIN },
  { id: '2', name: 'Student', email: 'student@test.com', password: 'password', role: ROLES.STUDENT },
];
export const initialExams = [];
export const initialResults = [];