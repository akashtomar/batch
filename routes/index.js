const router = require('express').Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const jobsRouter = require('./jobs');
const batchesRouter = require('./batches');
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
router.use(bodyParser.json());

router.use('/job', jobsRouter);
router.use('/batch', batchesRouter);


//route to removed later.
//just to generate token
router.get('/token', (req, res)=>{
    let privateKey = fs.readFileSync(path.join(__dirname, '../token/private.key'));
    let option = {
        issuer: "Batch",
        subject: req.query.subject,
        audience: req.query.subject,
        expiresIn: '12h',
        algorithm: 'RS256'
        }
    let token = jwt.sign({'batch':'module'}, privateKey, option);
    res.json({'success': true, 'token': token});
});




module.exports = router;
