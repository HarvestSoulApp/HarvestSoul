const express = require('express');
const Event = require('../models/Event.model');
const router = express.Router();

router.get("/",(req,res,next) => {
    res.send("hello")
});

router.get('/find', (req, res, next) => {
    Event.find()
        .then((events) => {
            res.render('event/events', { events})
    })
})


router.get('/eventCreate', (req, res, next) => {
    res.render('event/eventCreate')
})

router.post('/eventCreate', (req, res, next) => {
    const { date, description, location } = req.body
    Event.create({ date, description, location })
        .then((event) => {
            res.redirect(`/event/${event._id}`)
    })
});


router.post('/:id/eventUpdate', (req, res) => {
    const { date, description, location } = req.body
    const {id} = req.params
    Event.findByIdAndUpdate(id, {date, description, location})
    .then((event) => {
        res.redirect(`/event/${id}`)
    })
});

router.get("/:id/edit", (req, res) => {
    const {id} = req.params
    Event.findById(id)
    .then((event) => {
        const {date, description, location, _id} = event
        const calendarDate = date.toISOString().split('T')[0] //this formats the date object into string yyyy-mm-dd
        res.render('event/eventEdit', {calendarDate, description, location, _id})
    });


});


router.get('/:eventId', (req, res, next) => {
    const eventId = req.params.eventId;
    Event.findById(eventId)
        .then((event) => {
            const  {date, description, location, _id} = event
        res.render('event/event', {date, description, location, _id})
    })
    
})


router.post('/:eventId/delete', (req, res, next) => {
    const eventId = req.params.eventId
    Event.findByIdAndDelete(eventId)
        .then(() => { res.redirect('/event/eventCreate') })
    
});

module.exports = router;