const goalService = require('../goal/goal.service');

const getGoalsAccordingToResults = async (results, category, grade) => {
  const allGoals = await goalService.get();

  if (!allGoals.length) {
    return;
  }

  // Filter goals by category and grade
  const suitableGoals = allGoals.filter(goal =>
    goal.category === category && goal.grade === grade
  );

  if (!suitableGoals.length) {
    return;
  }

  // Determine the appropriate goal based on results
  let appropriateGoal = null;

  if (results >= 80) {
    appropriateGoal = suitableGoals.find(goal => goal.level === 'A');
  } else if (results >= 60 && results < 80) {
    appropriateGoal = suitableGoals.find(goal => goal.level === 'B');
  } else {
    appropriateGoal = suitableGoals.find(goal => goal.level === 'C');
  }

  return appropriateGoal;
};

module.exports = getGoalsAccordingToResults;
