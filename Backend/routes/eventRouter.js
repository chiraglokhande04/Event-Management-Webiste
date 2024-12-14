const eventController = require("../controllers/eventController")
const express = require('express');
const eventRouter = express.Router();  

eventRouter.post('/create',eventController.createEvent)
eventRouter.post('/register/:eventId',eventController.register)
eventRouter.post('/addreview/:eventId',eventController.addEventReview)
eventRouter.put('/details/:eventId',eventController.updateEventDetails)
eventRouter.get('/attendees/:eventId',eventController.getAllAttendees)
eventRouter.get('/registrations/:eventId',eventController.getAllRegistrations)
eventRouter.get('/eventdetails/:eventId',eventController.getEventDetails)
eventRouter.get('/reviews/:eventId',eventController.getEventReviews)
eventRouter.delete('/delete/:eventId',eventController.getAllAttendees)
eventRouter.post('/events/:eventId/attendance', eventController.markAttendance);


module.exports = eventRouter