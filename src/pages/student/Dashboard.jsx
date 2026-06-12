import React, { useEffect, useState } from 'react';
import { FiClock, FiCheckCircle, FiStar, FiAward } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext.jsx';
import StatCard from '../../components/StatCard.jsx';
import { resultService } from '../../services/resultService.js';
import { examService } from '../../services/examService.js';
import { useLocation } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [stats, setStats] = useState({ examsTaken: 0, averageScore: 0, passRate: 0, bestScore: 0 });
  const [recentResults, setRecentResults] = useState([]);

  useEffect(() => {
    const results = resultService.getResultsByStudent(user.id);
    
    let totalScore = 0;
    let passes = 0;
    let best = 0;

    results.forEach(r => {
      totalScore += r.percentage;
      if (r.status === 'Pass') passes++;
      if (r.percentage > best) best = r.percentage;
    });

    setStats({
      examsTaken: results.length,
      averageScore: results.length > 0 ? (totalScore / results.length).toFixed(1) : 0,
      passRate: results.length > 0 ? ((passes / results.length) * 100).toFixed(1) : 0,
      bestScore: best.toFixed(1)
    });

    setRecentResults(results.slice(-5).reverse());
  }, [user.id]);

  return (
    <div className="space-y-8">
      {location.state?.error && (
        <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm font-medium">
          {location.state.error}
        </div>
      )}
      {location.state?.info && (
        <div className="p-4 bg-blue-100 border border-blue-200 text-blue-700 rounded-md text-sm font-medium">
          {location.state.info}
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user.name}!</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Here's an overview of your progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Exams Taken" value={stats.examsTaken} icon={FiClock} colorClass="bg-blue-500" />
        <StatCard title="Average Score" value={`${stats.averageScore}%`} icon={FiStar} colorClass="bg-purple-500" />
        <StatCard title="Pass Rate" value={`${stats.passRate}%`} icon={FiCheckCircle} colorClass="bg-green-500" />
        <StatCard title="Best Score" value={`${stats.bestScore}%`} icon={FiAward} colorClass="bg-orange-500" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Results</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 font-medium">Exam</th>
                <th className="pb-3 font-medium">Score</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentResults.map(result => (
                <tr key={result.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <td className="py-3 text-gray-900 dark:text-gray-200">{result.examTitle}</td>
                  <td className="py-3 text-gray-900 dark:text-gray-200">{result.percentage.toFixed(1)}%</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${result.status === 'Pass' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {result.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500 text-sm">{new Date(result.submittedAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {recentResults.length === 0 && (
                <tr><td colSpan="4" className="py-4 text-center text-gray-500">No exams taken yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}