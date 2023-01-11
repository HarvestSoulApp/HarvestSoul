const express = require('express');
const router = express.Router();
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const isProfileOwner = require("../middleware/isProfileOwner");


/* GET home page */
router.get("/", (req, res, next) => {
  let loggedOut;
  if (!req.session) {
    loggedOut = true;
  }
  else {
    loggedOut = false
  }
  res.render("index" , loggedOut);
});

module.exports = router;
