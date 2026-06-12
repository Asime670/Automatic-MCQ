export const calculateScore = (exam, userAnswers) => {
  let score = 0;
  const correctAnswers = {};
  exam.questions.forEach((q) => {
    correctAnswers[q.id] = q.correctOption;
    if (userAnswers[q.id] === q.correctOption) {
      score += 1;
    }
  });
  const total = exam.questions.length;
  const percentage = total > 0 ? (score / total) * 100 : 0;
  return { score, total, percentage, correctAnswers };
};