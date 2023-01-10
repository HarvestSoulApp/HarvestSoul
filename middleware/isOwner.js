module.exports = (req, res, next) => {
  if (req.session.currentUser._id === req.params.id) {
    next();
  }
  else {
    console.log(`paramsId: ${req.params.id}, currentId: ${req.session.currentUser._id}`)
    res.send('wrong user')
  }
};


  
