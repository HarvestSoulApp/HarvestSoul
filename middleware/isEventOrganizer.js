module.exports = (req, res, next) => {
    if (req.session.currentUser._id === req.params.organizerId) {
      next();
    }
    else {
      console.log(`paramsId: ${req.params.organizerId}, currentId: ${req.session.currentUser._id}`)
      res.redirect('/auth/unauthorized')
    }
  };

  