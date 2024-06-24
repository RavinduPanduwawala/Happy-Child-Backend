const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { authenticateToken } = require('./api/helpers/authMiddleware');

const app = express();

app.use((req, res, next) => {
  console.log(`${new Date().toString()} => ${`${req.method} ${req.originalUrl}`}`);
  next();
});

app.get('/', async (req, res) => {
  res.send({
    message: 'Welcome to the Happy Child API.',
  });
});

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  authenticateToken(req, res, next);
});

app.use('/user', require('./api/user/user.controller'));
app.use('/assessment', require('./api/assessment/assessment.controller'));
app.use('/user-assessment', require('./api/userAssessment/userAssessment.controller'));
app.use('/goal', require('./api/goal/goal.controller'));

module.exports = app;
