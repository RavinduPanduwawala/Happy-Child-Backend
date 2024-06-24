const express = require('express');
const { body, validationResult } = require('express-validator');
const { success, error, validation } = require('../helpers/responses');

const goalService = require('./goal.service');
const userService = require('../user/user.service');

const router = express.Router();

router.post('/', create);
router.get('/', getAll);
router.get('/:userId', getGoalsByUserId);
router.put('/:id', updateById);
router.delete('/:id', remove);

module.exports = router;

async function create(req, res) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json(validation(errors.array()));
      return;
    }

    const newGoal = await goalService.create(req.body);

    return res.status(200).json(success('OK', newGoal, res.statusCode));
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
}


async function remove(req, res) {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(422).json(errors.array())
    }

    const existingGoal = await goalService.getById(req.params.id)

    if (!existingGoal) {
      return res.status(400).json(validation([{ msg: 'Missing goal!' }]));
    }

    await goalService.deleteById(req.params.id);

    return res.status(200).json(success('OK', {}, res.statusCode));
  } catch (e) {
    return res.status(500).json(e.message)
  }
}

async function getAll(req, res) {
  try {
    const goal = await goalService.get({});

    if (!goal) {
      return res.status(404).json(validation([{ msg: 'No goals found.' }]));
    }

    const filteredGoalsList = goal.filter((filteredGoal) => filteredGoal.isDeleted === false);

    return res.status(200).json(success('OK', filteredGoalsList, res.statusCode));
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
}

async function getGoalsByUserId(req, res) {
  try {
    const goals = await goalService.get({});


    if (!goals) {
      return res.status(404).json(validation([{ msg: 'No goals found.' }]));
    }

    const user = await userService.getById(req.params.userId);

    if (!user) {
      return res.status(404).json(validation([{ msg: 'No users found.' }]));
    }

    const userType = user.type;

    if (userType === 'ADMIN') {

      return res.status(200).json(success('OK', goals, res.statusCode));
    }

    const goalsList = await goalService.get({ userId: req.params.userId });

    if (!goalsList.length) {
      return res.status(404).json(error('No goals found for creator.'));
    }

    return res.status(200).json(success('OK', goalsList, res.statusCode));
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
}

async function updateById(req, res) {
  try {
    const updatedGoal = await goalService.update(req.body, req.params.id);

    return res.status(200).json(success('OK', updatedGoal, res.statusCode));
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
}
