const router = require('express').Router();
const bodyParser = require('body-parser');

const jobsRouter = require('./jobs');
const batchesRouter = require('./batches');
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
router.use(bodyParser.json());

router.use('/job', jobsRouter);
router.use('/batch', batchesRouter);






module.exports = router;
