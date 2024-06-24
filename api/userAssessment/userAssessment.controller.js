const express = require('express');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const { success, error, validation } = require('../helpers/responses');
const { BASE_WEB_URL } = require('../../config');
const sendEmail = require('../helpers/emailer');
const userAssessmentService = require('./userAssessment.service');
const userService = require('../user/user.service');
const assessmentService = require('../assessment/assessment.service');
const calculateAssessmentResults = require('../helpers/calculateAssessmentResults');
const getGoalsAccordingToResults = require('../helpers/getGoalsAccordingToResults');

const router = express.Router();

router.post('/public/:id', submit);
router.post('/assign', assignAssessments);
router.get('/user-type/:userType', getByUserType);
router.get('/user/:id', getByUser);
router.get('/student/:id', getByStudentId);
router.get('/public/:id', getForCompletion);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', deleteById);

module.exports = router;

function validate(method) {
  switch (method) {
    case 'create': {
      return [
        body('title', 'Title doesn\'t exist.').exists(),
        body('questions', 'Questions doesn\'t exist.').exists(),
      ];
    }
    default: return true;
  }
}

async function submit(req, res) {
  try {
    const users = await userService.getByEmail(req.body.email);

    if (!users.length) {
      return res.status(404).json(error('user not found'));
    }

    const calculatedMarks = calculateAssessmentResults(req.body.assessment, req.body.gameScore);

    const goal = await getGoalsAccordingToResults(calculatedMarks, req.body.assessment.category, req.body.assessment.grade);

    const payload = {
      userId: users[0]._id,
      assessment: req.body.assessment,
      calculatedMarks,
      goal,
    };

    const updatedAssessment = await userAssessmentService.update(payload, req.params.id);

    return res.status(200).json(success('OK', updatedAssessment, res.statusCode));
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
}

async function getAll(req, res) {
  try {
    const assessments = await userAssessmentService.getAll();

    return res.status(200).json(success('OK', assessments, res.statusCode));
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
}

async function getByUserType(req, res) {
  try {
    const assessments = await userAssessmentService.getAll();

    if (req.params.userType === 'WB_COORDINATOR') {
      const filteredAssessments = assessments.filter((product) => product.category !== 'ACCESS_LEVEL_C');

      return res.status(200).json(success('OK', filteredAssessments, res.statusCode));
    }

    if (req.params.userType === 'PSYCHOLOGIST') {
      return res.status(200).json(success('OK', assessments, res.statusCode));
    }
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
}

async function getByUser(req, res) {
  try {
    const user = await userService.getById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userType = user.type;
    let assessments = [];

    if (userType === 'TEACHER') {
      const studentsList = await userService.get({ grade: user.grade });

      if (!studentsList.length) {
        return res.status(404).json({ error: 'No students found for teacher.' });
      }

      for (let i = 0; i < studentsList.length; i++) {
        const student = studentsList[i];

        const completedAssessments = await userAssessmentService.get({ userId: student._id });

        if (completedAssessments.length) {
          assessments.push(...completedAssessments.map(assessment => ({
            ...assessment.toObject()
          })));
        }
      }

      return res.status(200).json({ message: 'OK', data: assessments });
    } else if (userType === 'STUDENT') {
      const completedAssessments = await userAssessmentService.get({ userId: user._id });

      if (completedAssessments.length) {
        assessments.push(...completedAssessments.map(assessment => ({
          ...assessment.toObject()
        })));
      }

      return res.status(200).json({ message: 'OK', data: assessments });
    }

    // If the user is an admin or another type
    const studentsList = await userService.get({ type: 'STUDENT' });

    if (!studentsList.length) {
      return res.status(404).json({ error: 'No students found for admin.' });
    }

    for (let i = 0; i < studentsList.length; i++) {
      const student = studentsList[i];

      const completedAssessments = await userAssessmentService.get({ userId: student._id });

      if (completedAssessments.length) {
        assessments.push(...completedAssessments.map(assessment => ({
          ...assessment.toObject()
        })));
      }
    }

    return res.status(200).json({ message: 'OK', data: assessments });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}



async function getByStudentId(req, res) {
  try {
    const user = await userService.getById(req.params.id);

    if (!user) {
      return res.status(404).json(error('user not found'));
    }

    const completedAssessments = await userAssessmentService.get({ userId: user._id });

    return res.status(200).json(success('OK', completedAssessments, res.statusCode));
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
}

async function assignAssessments(req, res) {
  try {
    const { userId } = req.body;

    const selectedAssessment = await assessmentService.getById(req.body.assessment);

    const userAssessment = await userAssessmentService.create({
      userId: userId,
      assessment: selectedAssessment,
    });

    const user = await userService.getById(userId);

    console.log('aaaaaa', user)

    const emailHtmlTemplate = fs.readFileSync(
      path.resolve(__dirname, '../assets/email-templates/assessment-link-send.html'),
      'utf8',
    );

    const template = handlebars.compile(emailHtmlTemplate);

    const link = `${BASE_WEB_URL}assessment/${userAssessment._id}?email=${user.email}&lan=en`;

    const htmlToSend = template({
      name: user.fullName,
      link,
    });
    const emailTitle = 'New assessment';

    await sendEmail(user.email, emailTitle, htmlToSend);

    // send mails here

    return res.status(200).json(success('OK', res.statusCode));
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
}

async function getById(req, res) {
  try {
    const assessment = await userAssessmentService.getById(req.params.id);

    return res.status(200).json(success('OK', assessment, res.statusCode));
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
}

async function getForCompletion(req, res) {
  // try {
  //   const assessment = await userAssessmentService.getById(req.params.id);

  //   return res.status(200).json(success('OK', assessment, res.statusCode));
  // } catch (e) {
  //   return res.status(500).json(error(e.message));
  // }
}

async function update(req, res) {
  try {
    const updatedAssessment = await userAssessmentService.update(req.body, req.params.id);

    return res.status(200).json(success('OK', updatedAssessment, res.statusCode));
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
}

async function deleteById(req, res) {
  try {
    await userAssessmentService.deleteById(req.params.id);

    return res.status(200).json(success('OK', {}, res.statusCode));
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
}
