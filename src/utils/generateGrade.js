export const generateGrade = (percentage) => {
  if (percentage >= 90) return { grade: 'A', status: 'Pass' };
  if (percentage >= 80) return { grade: 'B', status: 'Pass' };
  if (percentage >= 70) return { grade: 'C', status: 'Pass' };
  if (percentage >= 60) return { grade: 'D', status: 'Pass' };
  return { grade: 'F', status: 'Fail' };
};