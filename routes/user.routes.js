const express = require('express');
const User = require('../models/User.model');
const Event = require('../models/User.model');
const router = express.Router();

router.get('/find', (req, res, next) => {
    User.find()
        .then((users) => {
            res.render('profile/profiles', { users })
    })
})

router.get('/:id', (req, res, next) => {
    const userId = req.params._id;
    User.findById(userId)  
        .then((user) => {
     res.render('profile/profile', user)
 })  
})

router.get('/:id/edit', (req, res, next) => {
    const userId = req.params.id
    User.findById(userId)
        .then((theUser) => {
            res.render('profile/profileEdit', theUser )    
    })
});

router.post('/:id/edit', (req, res, next) => {
    const userId = req.params.id;
    const { firstName, lastName, gender, dob, starSign, occupation, hobbies, lookingFor } = req.body;
    User.findByIdAndUpdate(userId, 
        {firstName, lastName, gender, dob, starSign, occupation, hobbies, lookingFor},
        {new:true} 
        )
        .then((updatedUser) => {
        res.render('profile/profile', updatedUser)
    })
})




router.post('/:id/delete', (req, res, next) => {
    const userId =req.params.id
    User.findByIdAndDelete(userId)
        .then((deleted) => {
        res.redirect('/auth/logout')
    })
});
module.exports = router;

