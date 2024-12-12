const Event = require("../models/Event")
const User = require("../models/User")
const {sendEventCreatedEmail,sendeventRegistrationEmail,sendEventCancellationEmail} = require("../utils/email")


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
    event.attendees.push(userId)
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

const updateEventDetails = async(req,res)=>{
    const {eventId}= req.params
    const {title,description,banner,location,capacity} = req.body
    try{
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId, // The actual event ID from params
            {
                title,
                description,
                banner,
                location,
                capacity
            },
            { new: true } // Option to return the updated document
        );

        // If the event doesn't exist, return a 404
        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        

        return res.status(200).json({
            message: "Event Details updated successfully",
            user: updatedEvent,
        });

    }catch(err){
        console.error("Error in creating Event:", err);
        return res.status(500).json({ message: "Internal server error while updating an event details" });
    }
}

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

const deleteEvent = async (req, res) => {
    const { eventId } = req.params;

    try {
        // Find the event by ID
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Get the list of attendees from the event
        const attendees = event.attendees;  // No need for await here as it's an array

        // Send cancellation emails to all attendees
        try {
            await sendEventCancellationEmail(event, attendees);
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
            // .populate('reviews') 
            .populate('attendees'); 

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










module.exports = {
    register,
    createEvent,
    updateEventDetails,
    getAllAttendees,
    deleteEvent,
    getEventDetails,
    addEventReview,
    getEventReviews
}
