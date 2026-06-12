import { storageService } from './storageService.js';
import { STORAGE_KEYS } from '../utils/constants.js';

export const resultService = {
  getAllResults: () => storageService.get(STORAGE_KEYS.RESULTS) || [],
  getResultsByStudent: (studentId) => (storageService.get(STORAGE_KEYS.RESULTS) || []).filter(r => r.studentId === studentId),
  getResultsByExam: (examId) => (storageService.get(STORAGE_KEYS.RESULTS) || []).filter(r => r.examId === examId),
  getResultById: (id) => (storageService.get(STORAGE_KEYS.RESULTS) || []).find(r => r.id === id),
  saveResult: (resultData) => {
    const results = storageService.get(STORAGE_KEYS.RESULTS) || [];
    const newResult = { ...resultData, id: Date.now().toString(), submittedAt: new Date().toISOString() };
    storageService.set(STORAGE_KEYS.RESULTS, [...results, newResult]);
    return newResult;
  }
};