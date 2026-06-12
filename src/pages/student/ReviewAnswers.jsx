import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resultService } from '../../services/resultService.js';
import { examService } from '../../services/examService.js';
import { FiCheck, FiX, FiArrowLeft } from 'react-icons/fi';

export default function ReviewAnswers() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [exam, setExam] = useState(null);

  useEffect(() => {
    const res = resultService.getResultById(id);
    if (res) {
      setResult(res);
      setExam(examService.getExamById(res.examId));
    }
  }, [id]);

  if (!result || !exam) return <div className="p-8 text-center text-gray-500">Loading review...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to={`/student/result/${id}`} className="flex items-center text-primary-600 hover:text-primary-700 mb-2 font-medium">
            <FiArrowLeft className="mr-2" /> Back to Result
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Review Answers: {exam.title}</h2>
        </div>
        <div className="text-right bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500">Score</p>
          <p className="text-xl font-bold text-primary-600">{result.score} / {result.total}</p>
        </div>
      </div>

      <div className="space-y-6">
        {exam.questions.map((q, index) => {
          const userAnswer = result.userAnswers[q.id];
          const isCorrect = userAnswer === q.correctOption;
          const isUnanswered = userAnswer === undefined;

          return (
            <div key={q.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 overflow-hidden relative">
              <div className={`absolute top-0 left-0 w-1 h-full ${isCorrect ? 'bg-green-500' : (isUnanswered ? 'bg-yellow-500' : 'bg-red-500')}`}></div>
              
              <div className="flex items-start justify-between mb-4 pl-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white"><span className="text-gray-500 mr-2">{index + 1}.</span> {q.text}</h3>
                {isCorrect ? (
                  <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded text-sm font-medium"><FiCheck className="mr-1" /> Correct</span>
                ) : isUnanswered ? (
                  <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-sm font-medium">Unanswered</span>
                ) : (
                  <span className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded text-sm font-medium"><FiX className="mr-1" /> Incorrect</span>
                )}
              </div>

              <div className="space-y-3 pl-4 mt-4">
                {q.options.map((opt, optIndex) => {
                  const isThisCorrect = optIndex === q.correctOption;
                  const isThisUserSelected = optIndex === userAnswer;
                  
                  let bgClass = "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700";
                  if (isThisCorrect) bgClass = "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800";
                  else if (isThisUserSelected && !isThisCorrect) bgClass = "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800";

                  return (
                    <div key={optIndex} className={`p-3 rounded-lg border ${bgClass} flex items-center justify-between`}>
                      <span className={`${isThisCorrect ? 'text-green-800 dark:text-green-300 font-medium' : isThisUserSelected ? 'text-red-800 dark:text-red-300' : 'text-gray-700 dark:text-gray-300'}`}>
                        {opt}
                      </span>
                      {isThisCorrect && <FiCheck className="text-green-600" />}
                      {isThisUserSelected && !isThisCorrect && <FiX className="text-red-600" />}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}