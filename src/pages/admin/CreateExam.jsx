import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { examService } from '../../services/examService.js';

export default function CreateExam() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('30');
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (id) {
      const exam = examService.getExamById(id);
      if (exam) {
        setTitle(exam.title);
        setSubject(exam.subject);
        setDuration(exam.duration);
        setQuestions(exam.questions || []);
      }
    }
  }, [id]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { id: Date.now().toString(), text: '', options: ['', '', '', ''], correctOption: 0 }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const examData = { title, subject, duration, questions };
    if (id) {
      examService.updateExam(id, examData);
    } else {
      examService.createExam(examData);
    }
    navigate('/admin/exams');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">{id ? 'Edit Exam' : 'Create New Exam'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Exam Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
              <input type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Duration (minutes)</label>
              <input type="number" required min="1" value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Questions</h3>
              <button type="button" onClick={handleAddQuestion} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors">
                <FiPlus className="mr-2" /> Add Question
              </button>
            </div>

            <div className="space-y-6">
              {questions.map((q, qIndex) => (
                <div key={q.id} className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-medium text-gray-900 dark:text-white">Question {qIndex + 1}</span>
                    <button type="button" onClick={() => handleRemoveQuestion(qIndex)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
                  </div>
                  <input type="text" required placeholder="Enter question text" value={q.text} onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 mb-4 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center space-x-3">
                        <input type="radio" name={`correct-${q.id}`} required checked={q.correctOption === oIndex} onChange={() => handleQuestionChange(qIndex, 'correctOption', oIndex)} className="text-primary-600 focus:ring-primary-500" />
                        <input type="text" required placeholder={`Option ${oIndex + 1}`} value={opt} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {questions.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-center py-4">No questions added yet.</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button type="button" onClick={() => navigate('/admin/exams')} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">Save Exam</button>
          </div>
        </form>
      </div>
    </div>
  );
}