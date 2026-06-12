import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { examService } from '../../services/examService.js';

export default function Exams() {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    setExams(examService.getAllExams());
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      examService.deleteExam(id);
      setExams(examService.getAllExams());
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">All Exams</h2>
        <Link to="/admin/exams/create" className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <FiPlus className="mr-2" /> Create Exam
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <th className="px-4 py-3 font-medium rounded-tl-lg">Title</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Questions</th>
              <th className="px-4 py-3 font-medium">Duration</th>
              <th className="px-4 py-3 font-medium rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map(exam => (
              <tr key={exam.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 text-gray-900 dark:text-gray-200 font-medium">{exam.title}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{exam.subject}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{exam.questions?.length || 0}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{exam.duration} mins</td>
                <td className="px-4 py-3">
                  <div className="flex space-x-3">
                    <Link to={`/admin/exams/edit/${exam.id}`} className="text-blue-500 hover:text-blue-700"><FiEdit2 /></Link>
                    <button onClick={() => handleDelete(exam.id)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
            {exams.length === 0 && (
              <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">No exams found. Create one to get started.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}