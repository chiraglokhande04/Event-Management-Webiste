
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        req.user = decoded; // Add user details to request object
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

const checkIfHost = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id; 

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You are not the host of this event' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};





module.exports = {
    authMiddleware,
    checkIfHost
}
