var express = require('express'),
    router = express.Router(),
    passport = require('passport');

module.exports = router;


function restrict(req, res, next) {
    if (req.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Modern JavaScript' });
});

router.get('/restricted', restrict, function(req, res){
    res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});

router.get('/login', function(req, res, next) {
    if(req.user) {
        return res.redirect('/restricted');
    }
    res.render('login', { title: 'Login' });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/restricted',
    failureRedirect: '/login'
}));

router.get('/logout', function(req, res){
    req.logOut();
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function(){
        res.redirect('/');
    });
});
