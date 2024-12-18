const eventController = require("../controllers/eventController");
const express = require('express');
const eventRouter = express.Router();  
const { authMiddleware, checkIfHost } = require("../Middlewares/user");
const { bannerUpload } = require("../Middlewares/upload");

eventRouter.post('/create', authMiddleware, eventController.createEvent);
eventRouter.post('/register/:eventId', authMiddleware, eventController.register);
eventRouter.post('/addreview/:eventId', authMiddleware, eventController.addEventReview);
eventRouter.put('/details/:eventId', authMiddleware, checkIfHost,bannerUpload.single('banner'), eventController.updateEventDetails);
eventRouter.get('/attendees/:eventId',authMiddleware, checkIfHost, eventController.getAllAttendees);
eventRouter.get('/registrations/:eventId',authMiddleware, checkIfHost, eventController.getAllRegistrations);
eventRouter.get('/eventdetails/:eventId', eventController.getEventDetails);
eventRouter.get('/reviews/:eventId', eventController.getEventReviews);
eventRouter.delete('/delete/:eventId', authMiddleware, checkIfHost, eventController.deleteEvent);
eventRouter.post('/events/:eventId/attendance', authMiddleware, eventController.markAttendance);
eventRouter.get('/events/report/:eventId', authMiddleware, checkIfHost, eventController.getEventReport);

module.exports = eventRouter;
