module.exports = function(app, passport, db) {

// normal routes ===============================================================
let inventory = [{style: 'Ovo 12\'s', size: 'any'}, {style: 'Oreo 4\s', size: 'any'}, {style: 'Grape 4\'s', size: 'any'}, {style: 'Air 1\'s', size: 'any'}, {style: 'lightning 4\'s', size: 'any'}, {style: 'OG Fire Red 4\'s', size: 'any'}, {style: 'Yeezy 350 V2 Zebra',size: 'any'}, {style: 'Yeezy 350 V2 Citrin', size: 'any'}]

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('sneakers').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            sneakers: result,
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

// app.get('/profile', (req, res) => {
//   let inventory = [{style: 'Ovo 12\'s', size: 'any'}, {style: 'Oreo 4\s', size: 'any'}, {style: 'Grape 4\'s', size: 'any'}, {style: 'Air 1\'s', size: 'any'}, {style: 'lightning 4\'s', size: 'any'}, {style: 'OG Fire Red 4\'s', size: 'any'}, {style: 'Yeezy 350 V2 Zebra',size: 'any'}, {style: 'Yeezy 350 V2 Citrin', size: 'any'}]
//   console.log(inventory)
//   db.collection('sneakers').find().toArray((err, result) => {
//     if (err) return console.log(err)
//     res.render('profile.ejs', {
//       sneakers: result,
//       whatsIn: inventory 
//     })
//   })
// })

app.post('/special', (req, res) => {
  db.collection('sneakers').save({
    user: req.body.user, 
    style: req.body.style, 
    size: req.body.size,}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    console.log(result)
    res.redirect('/profile')
  })
})

    app.put('/sneakers', (req, res) => {
        db.collection('sneakers').findOneAndUpdate({user: req.body.user, style: req.body.style, size: req.body.size, tradeReqby : req.user.local.username}, {
        $set: {tradeReqBy : req.body.user}
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.delete('/sneakers', (req, res) => {
      db.collection('sneakers').findOneAndDelete({user: req.body.user, style: req.body.style, size: req.body.size, tradeReqBy : req.body.user}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
