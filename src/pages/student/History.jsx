import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resultService } from '../../services/resultService.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { FiEye } from 'react-icons/fi';

export default function History() {
  const [results, setResults] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    setResults(resultService.getResultsByStudent(user.id).reverse());
  }, [user.id]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Exam History</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <th className="px-4 py-3 font-medium rounded-tl-lg">Exam</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody>
            {results.map(result => (
              <tr key={result.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 text-gray-900 dark:text-gray-200 font-medium">{result.examTitle}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{new Date(result.submittedAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-gray-900 dark:text-gray-200">{result.percentage.toFixed(0)}%</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${result.status === 'Pass' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {result.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link to={`/student/result/${result.id}`} className="flex items-center text-primary-600 hover:text-primary-700">
                    <FiEye className="mr-1" /> View
                  </Link>
                </td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">No exams taken yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}