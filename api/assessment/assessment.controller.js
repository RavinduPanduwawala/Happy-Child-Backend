const express = require('express');
const { body, validationResult } = require('express-validator');
const { success, error, validation } = require('../helpers/responses');

// Import Services
const assessmentService = require('./assessment.service');
const userAssessmentService = require('../userAssessment/userAssessment.service');

const router = express.Router();

// API endpoints
router.post('/', validate('create'), create);
router.get('/', getAll);
router.get('/:grade', getAssessmentsByGrade);
router.get('/public/:id', getForCompletion);
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

async function create(req, res) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json(validation(errors.array()));
      return;
    }

    const newAssessment = await assessmentService.create(req.body);

    return res.status(200).json(success('OK', newAssessment, res.statusCode));
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
}

async function getAll(req, res) {
  try {
    const assessments = await assessmentService.getAll();

    const deletedFilteredAssessment = assessments.filter((assessment) => assessment.isDeleted !== true);

    return res.status(200).json(success('OK', deletedFilteredAssessment, res.statusCode));
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
}

async function getAssessmentsByGrade(req, res) {
  try {
    const assessments = await assessmentService.getAll();

    if (!assessments) {
      return res.status(404).json(validation([{ msg: 'No assessments found.' }]));
    }

    if (req.params.grade === 'ALL') {

      return res.status(200).json(success('OK', assessments, res.statusCode));
    }

    const filteredAssessmentsList = assessments.filter((filteredAssessment) => filteredAssessment.grade === req.params.grade);

    return res.status(200).json(success('OK', filteredAssessmentsList, res.statusCode));
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
}

async function getById(req, res) {
  try {
    const assessment = await assessmentService.getById(req.params.id);

    return res.status(200).json(success('OK', assessment, res.statusCode));
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
}

async function getForCompletion(req, res) {
  try {
    const assessment = await userAssessmentService.getById(req.params.id);

    return res.status(200).json(success('OK', assessment, res.statusCode));
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
}

async function update(req, res) {
  try {
    const updatedAssessment = await assessmentService.update(req.body, req.params.id);

    return res.status(200).json(success('OK', updatedAssessment, res.statusCode));
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
}

async function deleteById(req, res) {
  try {
    await assessmentService.deleteById(req.params.id);

    return res.status(200).json(success('OK', {}, res.statusCode));
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
}
