const express = require('express');
const router = express.Router();

const recordController = require('../controllers/recordController');

router.post('/addNote',recordController.addNote);
router.post('/getRecord',recordController.getRecord);
router.post('/getNote',recordController.getNote);
router.post('/reviseNote',recordController.reviseNote);
router.post('/getAllRecord',recordController.getALLRecord);

router.post('/mark',recordController.mark);
router.post('/getMarkNote',recordController.getMarkNote);


module.exports = router;