import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { examService } from '../../services/examService.js';
import { resultService } from '../../services/resultService.js';
import { calculateScore } from '../../utils/calculateScore.js';
import { generateGrade } from '../../utils/generateGrade.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { FiClock, FiAlertCircle } from 'react-icons/fi';

export default function TakeExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [exam, setExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetchedExam = examService.getExamById(id);
    if (!fetchedExam) {
      navigate('/student/exams');
      return;
    }
    setExam(fetchedExam);
    setTimeLeft(fetchedExam.duration * 60);
  }, [id, navigate]);

  useEffect(() => {
    if (!timeLeft) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelectOption = (optionIndex) => {
    setAnswers({ ...answers, [exam.questions[currentQuestion].id]: optionIndex });
  };

  const handleSubmit = () => {
    const { score, total, percentage, correctAnswers } = calculateScore(exam, answers);
    const { grade, status } = generateGrade(percentage);
    
    const resultData = {
      studentId: user.id,
      studentName: user.name,
      examId: exam.id,
      examTitle: exam.title,
      score,
      total,
      percentage,
      grade,
      status,
      userAnswers: answers,
      correctAnswers
    };

    const newResult = resultService.saveResult(resultData);
    navigate(`/student/result/${newResult.id}`);
  };

  if (!exam) return <div className="p-8 text-center">Loading...</div>;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isLastQuestion = currentQuestion === exam.questions.length - 1;
  const q = exam.questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{exam.title}</h2>
          <div className={`flex items-center font-mono text-lg ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-primary-600 dark:text-primary-400'}`}>
            <FiClock className="mr-2" /> {formatTime(timeLeft)}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span>Question {currentQuestion + 1} of {exam.questions.length}</span>
            <span>Answered: {Object.keys(answers).length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div className="bg-primary-600 h-2 rounded-full transition-all duration-300" style={{ width: `${((currentQuestion + 1) / exam.questions.length) * 100}%` }}></div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 leading-relaxed">{q.text}</h3>
          <div className="space-y-3">
            {q.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[q.id] === index ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-900 dark:text-primary-100' : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 dark:text-gray-200 text-gray-700'}`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${answers[q.id] === index ? 'border-primary-500 text-primary-500' : 'border-gray-400'}`}>
                    {answers[q.id] === index && <div className="w-2.5 h-2.5 rounded-full bg-primary-500"></div>}
                  </div>
                  {option}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-2 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Previous
          </button>
          
          {isLastQuestion ? (
            <button
              onClick={() => { if(window.confirm('Are you sure you want to submit?')) handleSubmit(); }}
              className="px-6 py-2 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              Submit Exam
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(prev => Math.min(exam.questions.length - 1, prev + 1))}
              className="px-6 py-2 rounded-lg font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}