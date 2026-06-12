import React, { useState, useEffect } from 'react';
import { resultService } from '../../services/resultService.js';
import { exportCSV } from '../../utils/exportCSV.js';

export default function Results() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    setResults(resultService.getAllResults());
  }, []);

  const handleExport = () => {
    const data = results.map(r => ({
      Exam: r.examTitle,
      Student: r.studentName,
      Score: r.score,
      Total: r.total,
      Percentage: r.percentage,
      Grade: r.grade,
      Status: r.status,
      Date: new Date(r.submittedAt).toLocaleDateString()
    }));
    exportCSV(data, 'student_results.csv');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Student Results</h2>
        <button onClick={handleExport} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <th className="px-4 py-3 font-medium rounded-tl-lg">Student</th>
              <th className="px-4 py-3 font-medium">Exam</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Grade</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium rounded-tr-lg">Date</th>
            </tr>
          </thead>
          <tbody>
            {results.map(result => (
              <tr key={result.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 text-gray-900 dark:text-gray-200 font-medium">{result.studentName}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{result.examTitle}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{result.score}/{result.total} ({result.percentage.toFixed(1)}%)</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-200">{result.grade}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${result.status === 'Pass' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {result.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{new Date(result.submittedAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">No results found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}