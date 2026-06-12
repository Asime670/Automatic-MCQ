import React, { useEffect, useState } from 'react';
import { FiUsers, FiFileText, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/StatCard.jsx';
import { examService } from '../../services/examService.js';
import { resultService } from '../../services/resultService.js';
import { storageService } from '../../services/storageService.js';
import { STORAGE_KEYS } from '../../utils/constants.js';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalExams: 0, totalStudents: 0, totalAttempts: 0, passRate: 0 });
  const [recentResults, setRecentResults] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const exams = examService.getAllExams();
    const results = resultService.getAllResults();
    const users = storageService.get(STORAGE_KEYS.USERS) || [];
    const students = users.filter(u => u.role === 'student');

    const passCount = results.filter(r => r.percentage >= 60).length;
    const passRate = results.length > 0 ? ((passCount / results.length) * 100).toFixed(1) : 0;

    setStats({
      totalExams: exams.length,
      totalStudents: students.length,
      totalAttempts: results.length,
      passRate
    });

    setRecentResults(results.slice(-5).reverse());

    const data = exams.map(exam => {
      const examResults = results.filter(r => r.examId === exam.id);
      const avgScore = examResults.length > 0 ? examResults.reduce((acc, curr) => acc + curr.percentage, 0) / examResults.length : 0;
      return { name: exam.title.substring(0, 10) + '...', avgScore: Math.round(avgScore) };
    });
    setChartData(data);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Exams" value={stats.totalExams} icon={FiFileText} colorClass="bg-blue-500" />
        <StatCard title="Total Students" value={stats.totalStudents} icon={FiUsers} colorClass="bg-green-500" />
        <StatCard title="Total Attempts" value={stats.totalAttempts} icon={FiCheckCircle} colorClass="bg-purple-500" />
        <StatCard title="Pass Rate" value={`${stats.passRate}%`} icon={FiTrendingUp} colorClass="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Average Scores by Exam</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgScore" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Submissions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 font-medium">Exam</th>
                  <th className="pb-3 font-medium">Score</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentResults.map(result => (
                  <tr key={result.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <td className="py-3 text-gray-900 dark:text-gray-200">{result.examTitle}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${result.percentage >= 60 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {result.percentage.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 text-gray-500 text-sm">{new Date(result.submittedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {recentResults.length === 0 && (
                  <tr><td colSpan="3" className="py-4 text-center text-gray-500">No recent submissions</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}