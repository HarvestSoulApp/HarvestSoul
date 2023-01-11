const express = require('express');
const User = require('../models/User.model');
const Event = require('../models/User.model');
const router = express.Router();
const fileUploader = require('../config/cloudinary.config');


// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const isProfileOwner = require("../middleware/isProfileOwner");


router.get('/find', (req, res, next) => {
    User.find()
        .then((users) => {
            res.render('profile/profiles', { users })
    })
})

router.get('/:id', (req, res, next) => {
    const userId = req.params.id;
    User.findById(userId)  
        .then((user) => {
            const comparison = userId === req.session.currentUser._id.toString()
            console.log(user)
     res.render('profile/profile', {username: user.username, firstName: user.firstName, gender: user.gender, imageUrl: user.imageUrl, lastName: user.lastName, starSign: user.starSign, dob: user.dob, comparison: comparison, _id: user._id })
 })  
})

router.get('/:id/edit', isProfileOwner,  isLoggedIn,(req, res, next) => {
    const userId = req.params.id
    console.log(userId)
    User.findById(userId)
        .then((theUser) => {
            res.render('profile/profileEdit', theUser )    
    })
});

router.post('/:id/edit', isProfileOwner, isLoggedIn, fileUploader.single('imageUrl'), (req, res, next) => {
    const userId = req.params.id;
    const { firstName, lastName, gender, dob, starSign, occupation, hobbies, lookingFor} = req.body;
   let imageUrl;
    if(req.file){
         imageUrl = req.file.path;
    }
    User.findByIdAndUpdate(userId, 
        {firstName, lastName, gender, dob, starSign, occupation, hobbies, lookingFor, imageUrl},
        {new:true} 
        )
        .then((updatedUser) => {
            console.log(updatedUser)
        res.render('profile/profile', updatedUser)
    })
})

router.post('/:id/delete', isProfileOwner, isLoggedIn, (req, res, next) => {
    const userId =req.params.id
    User.findByIdAndDelete(userId)
        .then((deleted) => {
        res.redirect('/auth/logout')
    })
});



module.exports = router;

