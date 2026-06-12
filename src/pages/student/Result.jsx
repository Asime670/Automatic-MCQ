import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resultService } from '../../services/resultService.js';
import { FiCheckCircle, FiXCircle, FiAward, FiArrowRight } from 'react-icons/fi';

export default function Result() {
  const { id } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    setResult(resultService.getResultById(id));
  }, [id]);

  if (!result) return <div className="p-8 text-center text-gray-500">Result not found.</div>;

  const isPass = result.status === 'Pass';

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className={`p-8 text-center text-white ${isPass ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-4">
            {isPass ? <FiAward className="w-10 h-10" /> : <FiXCircle className="w-10 h-10" />}
          </div>
          <h2 className="text-3xl font-bold mb-2">{isPass ? 'Congratulations!' : 'Keep Practicing!'}</h2>
          <p className="text-white/90 text-lg">You have {isPass ? 'passed' : 'failed'} the {result.examTitle} exam.</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Final Score</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{result.percentage.toFixed(0)}%</p>
              <p className="text-sm text-gray-500 mt-1">{result.score} / {result.total} Correct</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Grade</p>
              <p className={`text-3xl font-bold mt-1 ${isPass ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{result.grade}</p>
              <p className="text-sm text-gray-500 mt-1">Status: {result.status}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/student/review/${result.id}`} className="flex items-center justify-center px-6 py-3 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 rounded-lg font-medium hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors">
               Review Answers <FiArrowRight className="ml-2" />
            </Link>
            <Link to="/student" className="flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
               Back to Dashboard
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}