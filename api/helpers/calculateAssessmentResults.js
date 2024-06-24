function calculateAssessmentResults(assessment, gameScore) {
  // Scores corresponding to each rating
  const scoreMapping = {
    "good": 5,
    "middle": 3,
    "poor": 1
  };

  // Maximum possible score for the assessment part (10 questions)
  const maxAssessmentScore = 5 * 10; // Since each question can score a maximum of 5

  // Calculate the total assessment score
  let totalAssessmentScore = 0;
  assessment.questions.forEach(question => {
    const selectedAnswer = question.selectedAnswer || "poor"; // Default to "poor" if not provided
    const answer = question.answers.find(a => a.score === selectedAnswer);
    const answerScore = answer ? scoreMapping[answer.score] : scoreMapping["poor"]; // Default to "poor" score if answer is not found   
    totalAssessmentScore += answerScore;
  });

  // Calculate the assessment percentage
  const assessmentPercentage = (totalAssessmentScore / maxAssessmentScore) * 100;

  // Maximum game score is 9
  const maxGameScore = 9;

  // Calculate the game score percentage
  const gamePercentage = (gameScore / maxGameScore) * 100;

  // Calculate the final combined percentage
  const finalPercentage = (assessmentPercentage * 0.5) + (gamePercentage * 0.5);

  // Return the final combined percentage
  return finalPercentage.toFixed(2); // Return as a string with two decimal places
}

module.exports = calculateAssessmentResults;


