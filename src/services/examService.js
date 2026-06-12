import { storageService } from './storageService.js';
import { STORAGE_KEYS } from '../utils/constants.js';

export const examService = {
  getAllExams: () => storageService.get(STORAGE_KEYS.EXAMS) || [],
  getExamById: (id) => (storageService.get(STORAGE_KEYS.EXAMS) || []).find(e => e.id === id),
  createExam: (examData) => {
    const exams = storageService.get(STORAGE_KEYS.EXAMS) || [];
    const newExam = { ...examData, id: Date.now().toString(), createdAt: new Date().toISOString() };
    storageService.set(STORAGE_KEYS.EXAMS, [...exams, newExam]);
    return newExam;
  },
  updateExam: (id, examData) => {
    const exams = storageService.get(STORAGE_KEYS.EXAMS) || [];
    const index = exams.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Exam not found');
    exams[index] = { ...exams[index], ...examData, updatedAt: new Date().toISOString() };
    storageService.set(STORAGE_KEYS.EXAMS, exams);
    return exams[index];
  },
  deleteExam: (id) => {
    const exams = storageService.get(STORAGE_KEYS.EXAMS) || [];
    storageService.set(STORAGE_KEYS.EXAMS, exams.filter(e => e.id !== id));
  }
};