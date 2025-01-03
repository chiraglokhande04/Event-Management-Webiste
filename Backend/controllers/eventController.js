const Event = require("../models/Event")
const User = require("../models/User")
const {sendEventCreatedEmail,sendeventRegistrationEmail,sendEventCancellationEmail,sendEventDetailsUpdateEmail} = require("../utils/email")


const register = async(req,res)=>{
    const{ eventId} = req.params
    const{userId} = req.body
   try{
    const event = await Event.findById(eventId)
    const user = await User.findById(userId)
   
    if(!event){
        console.log("Event Not Found")
        return res.status(404).json({message:"Event Not Found"})
    }

    if(!user){
        console.log("User Not Found")
        return res.status(404).json({message:"User Not Found"})
    }

    if (user.registeredEvents.includes(eventId)) {
        return res.status(400).json({ message: "Already registered for this event" });
    }

    if (Date.now() > event.registrationLastDate){
        console.log("Registration Closed")
        return res.status(403).json({message:"Registration Closed"})
    }

    user.registeredEvents.push(eventId)
    await user.save()
    event.registrations.push(userId)
    await event.save()

    await sendeventRegistrationEmail(user,event)

    return res.status(200).json({message:"Registered For event successfully"})
   }catch(err){
    console.log("Error while registering for an Event:", err)
    return res.status(500).json({message:"error in registering for an event"})
   }
}

const createEvent = async (req, res) => {
    const { title, host, location, startDate, endDate, registrationLastDate,cost } = req.body;

    // Input validation
    if (!title || !host || !location || !startDate || !endDate || !registrationLastDate) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        
        // Create a new event
        const newEvent = await Event.create({
            title,
            location,
            host,
            startDate,
            endDate,
            registrationLastDate,
            cost
        });

        const hostUser = await User.findByIdAndUpdate(
            host,
            { $push: { eventsHosted: newEvent} },
            { new: true } // Return the updated document
        );
        console.log(hostUser)
        await sendEventCreatedEmail(hostUser,newEvent)

        if (!hostUser) {
            return res.status(404).json({ message: "Host user not found" });
        }

        return res.status(201).json({ message: "Event Created Successfully", event: newEvent });
    } catch (err) {
        console.error("Error in creating Event:", err);
        return res.status(500).json({ message: "Internal server error while creating an event" });
    }
};

const updateEventDetails = async (req, res) => {
    const { eventId } = req.params;
    const { title, description, location, capacity } = req.body;
    let banner = req.body.banner; // Initial banner from request body

    try {
        // Handle file upload for banner if a new file is uploaded
        if (req.file && req.file.path) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'eventManagement/banners', // Update the folder name as needed
            });
            banner = result.secure_url; // Set the new banner URL if file uploaded
        }

        // Update the event details with the provided fields
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            {
                ...(title && { title }),
                ...(description && { description }),
                ...(banner && { banner }),
                ...(location && { location }),
                ...(capacity && { capacity }),
            },
            { new: true, runValidators: true } // Return updated event and validate inputs
        );

        // If the event doesn't exist, return a 404
        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Send email about the event details update
        await sendEventDetailsUpdateEmail(updatedEvent, updatedEvent.registrations);

        return res.status(200).json({
            message: "Event Details updated successfully",
            event: updatedEvent,
        });

    } catch (err) {
        console.error("Error in updating Event:", err);
        return res.status(500).json({ message: "Internal server error while updating event details" });
    }
};


const getAllAttendees = async(req,res)=>{
    const {eventId}=req.params
    try{
        const event = await Event.findById(eventId).populate('attendees')
        if(!event){
            console.log("Event Not Found !")
            return res.status(404).json({message:"Event Not found"})
        }
        const attendees = event.attendees
        return res.status(200).json({message:"Attendees",attendees})
    }catch(err){
        console.error("Error in fetching attendees:", err);
        return res.status(500).json({ message: "Internal server error while fetching attendees" });
    }
}

const getAllRegistrations = async(req,res)=>{
    const {eventId}=req.params
    try{
        const event = await Event.findById(eventId).populate('registrations')
        if(!event){
            console.log("Event Not Found !")
            return res.status(404).json({message:"Event Not found"})
        }
        const registrations = event.registrations
        return res.status(200).json({message:"registrations",registrations})
    }catch(err){
        console.error("Error in fetching registrations:", err);
        return res.status(500).json({ message: "Internal server error while fetching registrations" });
    }
}

const deleteEvent = async (req, res) => {
    const { eventId } = req.params;

    try {
        // Find the event by ID
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        const registrations = event.registrations;  

        try {
            await sendEventCancellationEmail(event, registrations);
        } catch (emailErr) {
            console.log("Error sending cancellation emails", emailErr);
            return res.status(500).json({ message: "Error sending cancellation emails", error: emailErr.message });
        }
        // Delete the event
        await Event.deleteOne({ _id: eventId });
        // Return success response
        return res.status(200).json({ message: "Event deleted and cancellation emails sent successfully" });
    } catch (err) {
        console.log("Error in deleting event", err);
        return res.status(500).json({ message: "Error in deleting event", error: err.message });
    }
};

const getEventDetails = async (req, res) => {
    const { eventId } = req.params;
    try {
        // Fetch the event by its ID
        const event = await Event.findById(eventId)
            .populate('host') 
            .populate('reviews') 
            .populate('attendees')
            .populate('registrations');

        // If the event is not found, return a 404 error
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Return the event details
        return res.status(200).json({ event });
    } catch (err) {
        console.log("Error in fetching event details", err);
        return res.status(500).json({ message: "Error in fetching event details", error: err.message });
    }
};

const addEventReview = async (req, res) => {
    const { eventId } = req.params;
    const { userId, review } = req.body;
    if (!userId || !review) {
        return res.status(400).json({ message: "User ID and review text are required" });
    }

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const existingReview = event.reviews.find(r => r.user.toString() === userId);
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this event" });
        }
        event.reviews.push({
            user: userId,  
            review: review,
            createdAt: Date.now()  
        });

        await event.save();
       return res.status(200).json({ message: "Review added successfully" });
    } catch (err) {
        console.log("Error in adding review", err);
        return res.status(500).json({ message: "Error in adding review", error: err.message });
    }
};

const getEventReviews = async(req,res)=>{
    const {eventId}= req.params;
    try{
        const event = await Event.findById(eventId).populate('reviews');
        if(!event){
            return res.status(404).json({ message: "Event not found" });
        }
        Name = event.title
        reviews = event.reviews
        return res.status(200).json({Name,reviews})

    }catch(err){
        console.log("Error in getting reviews", err);
        return res.status(500).json({ message: "Error in getting reviews", error: err.message });
    }
}
const markAttendance = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { userId } = req.body;

        // Validate inputs
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        // Find the event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        // Check if user is registered for the event
        if (!event.registrations.includes(userId)) {
            return res.status(400).json({ message: 'User is not registered for this event.' });
        }

        // Check if the user has already been marked as an attendee
        if (event.attendees.includes(userId)) {
            return res.status(400).json({ message: 'User is already marked as an attendee.' });
        }

        // Add the user to the attendees list
        event.attendees.push(userId);
        await event.save();

        // Update the user's attendedEvents
        await User.findByIdAndUpdate(userId, {
            $addToSet: { attendedEvents: eventId } // Prevent duplicates
        });

        res.status(200).json({ message: 'Attendance marked successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
};

const getEventReport = async (req, res) => {
    try {
        const {eventId} = req.params;  

        const event = await Event.findById(eventId)
            .populate('attendees', 'username fullName email')  
            .populate('registrations', 'username fullName email');  

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const report = {
            eventTitle: event.title,
            eventDescription: event.description,
            eventLocation: event.location,
            startDate: event.startDate,
            endDate: event.endDate,
            capacity: event.capacity,
            registrationsCount: event.registrations.length,
            attendeesCount: event.attendees.length,
            registrations: event.registrations,
            attendees: event.attendees
        };

        res.status(200).json({ message: 'Event report fetched successfully', report });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};












module.exports = {
    register,
    createEvent,
    updateEventDetails,
    getAllAttendees,
    deleteEvent,
    getEventDetails,
    addEventReview,
    getEventReviews,
    getAllRegistrations,
    markAttendance,
    getEventReport
    
}
