const express = require("express");
const CaptureController = require("../controllers/CaptureController");

const router = express.Router();


router.post('/api/capture', CaptureController.createCapture)
router.get('/api/capture', CaptureController.getImage)

module.exports = router;