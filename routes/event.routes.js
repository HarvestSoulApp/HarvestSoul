const express = require('express');
const Event = require('../models/Event.model');
const User = require('../models/User.model');
const router = express.Router();
const fileUploader = require('../config/cloudinary.config');



// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const isProfileOwner = require("../middleware/isProfileOwner");
const isEventOrganizer = require('../middleware/isEventOrganizer');


router.get('/find', isLoggedIn, (req, res, next) => {
    Event.find()
        .then((events) => {
            res.render('event/events', { events})
    })
});



router.get('/eventCreate/:organizerId', isLoggedIn, (req, res, next) => {
    console.log(req.session)
    res.render('event/eventCreate')
})

router.post('/eventCreate/:organizerId', isLoggedIn, fileUploader.single('imageUrl'),(req, res, next) => {
    const { date, description, location } = req.body
    let imageUrl;
    if(req.file){
         imageUrl = req.file.path;
    }
    const organizerId = req.params.organizerId
    Event.create({ date, description, location, organizerName: req.session.currentUser.username, organizer: req.session.currentUser._id, imageUrl})
       .then((event) => {
        console.log(`this is ${event.imageUrl}`)
           res.redirect(`/event/${event._id}`)
    })
})


router.get("/:id/eventUpdate", isLoggedIn, isEventOrganizer, (req, res) => {
    const {id} = req.params
    // const organizerName = req.session.currentUser._id
    Event.findById(id)
    .then((event) => {
        const {date, description, location, _id, organizerName, imageUrl } = event
        const calendarDate = date//.toISOString().split('T')[0] //this formats the date object into string yyyy-mm-dd
        res.render('event/eventEdit', {calendarDate, description, location, _id, organizerName, imageUrl})
    });


});

 
router.post('/:id/eventUpdate', isLoggedIn, isEventOrganizer, fileUploader.single('imageUrl'),(req, res) => {
    const { date, description, location } = req.body
    let imageUrl;
    if(req.file){
         imageUrl = req.file.path;
    }
    const {id} = req.params
    Event.findByIdAndUpdate(id, {date, description, location, imageUrl})
    .then((event) => {
        res.redirect(`/event/${id}`)
    })
});

/*router.get("/:id/edit", isLoggedIn, (req, res) => {
    const {id} = req.params
    // const organizerName = req.session.currentUser._id
    Event.findById(id)
    .then((event) => {
        const {date, description, location, _id, organizerName } = event
        const calendarDate = date//.toISOString().split('T')[0] //this formats the date object into string yyyy-mm-dd
        res.render('event/eventEdit', {calendarDate, description, location, _id, organizerName})
    });


});*/

router.get('/:eventId', isLoggedIn, (req, res, next) => {
const {currentUser} = req.session;
const currentUserId = currentUser._id;
    const eventId = req.params.eventId;
    Event.findById(eventId)
        .then((event) => {
            //we need to take the interested array and get all names of interested users by their Id
            const  {date, description, location, _id, interested, organizerName,imageUrl} = event
            User.find({_id:{$in:interested}}).then((users) => {
                const usernames = users.map(user => user.username)
                res.render('event/event', {date, description, location, _id, currentUserId, usernames, organizerName, imageUrl})
            })
        })
    
})

router.post('/:eventId/delete', isLoggedIn, isEventOrganizer, (req, res, next) => {
    const eventId = req.params.eventId
    Event.findByIdAndDelete(eventId)
        .then(() => { res.redirect('/event/eventCreate') })
    
});

//adds loged in user id to the interested property of respective event if unique
router.post('/:eventId/subscribeUser/:userId', isLoggedIn, (req, res, next) => {
    const eventId = req.params.eventId
    const userId = req.params.userId
    Event.findByIdAndUpdate(eventId, {$addToSet:{interested:userId}})
    .then(() => { res.redirect(`/event/${eventId}`)})
});

module.exports = router;