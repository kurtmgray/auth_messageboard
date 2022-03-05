const express = require('express')
const router = express.Router()

const boardcontroller = require('../controllers/boardcontroller')
const usercontroller = require('../controllers/usercontroller')


// GET all messages, check for currentUser
router.get('/', boardcontroller.all_messages_get)

// GET form for submitting new message (currentUser === true) for this for to display, else redirect to log-in
router.get('/new-message', boardcontroller.message_form_get)

// POST form for creating new message, redirect to /board, or ('/')
router.post('/new-message', boardcontroller.message_form_post)

// GET form - sign up
router.get('/sign-up', usercontroller.sign_up_form_get)

// POST form - sign up
router.post('/sign-up', usercontroller.sign_up_form_post)

// GET form - login
router.get('/log-in', usercontroller.log_in_get)

// POST form - login
router.post('/log-in', usercontroller.log_in_post)

//GET log out
router.get('/log-out', usercontroller.log_out_get)

module.exports = router