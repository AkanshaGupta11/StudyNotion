const express = require("express")
const router = express.Router()

const { capturePayment, verifySignature, sendPaymentSuccessEmail } = require("../controllers/Payements.controller")
const { auth, isInstructor, isStudent } = require("../middlewares/auth.middleware")


router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifySignature",auth,isStudent, verifySignature)
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail)

module.exports = router;