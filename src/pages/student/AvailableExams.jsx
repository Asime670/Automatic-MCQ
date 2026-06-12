import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { examService } from '../../services/examService.js';
import { resultService } from '../../services/resultService.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { FiClock, FiFileText } from 'react-icons/fi';

export default function AvailableExams() {
  const [exams, setExams] = useState([]);
  const [takenExams, setTakenExams] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const allExams = examService.getAllExams();
    const results = resultService.getResultsByStudent(user.id);
    const takenIds = results.map(r => r.examId);
    
    setExams(allExams);
    setTakenExams(takenIds);
  }, [user.id]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Available Exams</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam, index) => {
          const hasTaken = takenExams.includes(exam.id);
          return (
            <motion.div key={exam.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-full">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">{exam.title}</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 rounded-full">{exam.subject}</span>
                </div>
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <p className="flex items-center"><FiFileText className="mr-2" /> {exam.questions?.length || 0} Questions</p>
                  <p className="flex items-center"><FiClock className="mr-2" /> {exam.duration} Minutes</p>
                </div>
              </div>
              {hasTaken ? (
                <button disabled className="w-full py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed dark:bg-gray-700 dark:text-gray-400">
                  Already Taken
                </button>
              ) : (
                <button onClick={() => navigate(`/student/exams/take/${exam.id}`)} className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  Take Exam
                </button>
              )}
            </motion.div>
          );
        })}
        {exams.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
            No exams available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}