const express = require('express');
const model = require('../model.js');

const router = express.Router();


router.get('/getList', (req, res) => {
  model.getAllAds()
    .then((data) => {
      res.status(200).json({
        ads: data,
      });
    }, (err) => {
      console.log(`Error fetching admin slotlist: ${err}`);
    });
});

router.post('/getAnnons', (req, res) => {
  const id = req.body.adID;
  console.log('body-->: ', id);

  model.getAnnons(id)
    .then((data) => {
      res.status(200).json({
        adInfo: data,
      });
    }, (err) => {
      console.log(`Error fetching admin slotlist: ${err}`);
    });
});

router.post('/login', (req, res) => {
  const username = req.body.usern;
  const password = req.body.passw;
  model.tryLogin(username, password)
    .then((data) => {
      if (data) {
        req.session.usern = username;
        req.session.loggedIn = true;
        req.session.cookie.maxAge = 1000000;
        req.session.save((err) => {
          if (err) console.error(err);
          else console.debug(`Saved username: ${req.session.usern}`);
        });
        res.sendStatus(200);
      } else { res.sendStatus(401); }
    }, (error) => {
      console.log(`Error database login: ${error}`);
    });
});

router.get('/checkAuth', (req, res) => {
  if (req.session.loggedIn && req.session.usern !== undefined) {
    res.status(200).json({ authenticated: true });
  } else {
    res.status(200).json({ authenticated: false });
  }
});

router.post('/register', (req, res) => {
  console.log(req.body);
  const username = req.body.usern;
  const mejl = req.body.mail;
  const pw = req.body.passw;
  const phonenr = req.body.nr;

  model.registerCheck(username, mejl)
    .then((data) => {
      if (!data) {
        // om det finns en användare --> username finns redan
        res.status(403).send('Username already exists');
      } else {
        model.newUser(username, mejl, pw, phonenr);
        res.status(200).json({ authenticated: true });
      }
    });
});

router.post('/createAnnons', () => {
  /**
   * Ska skapa en annons och ska även göra emit till alla klienter i ads.vue!
   */
  model.createAnnons();
});

router.post('/searchAd', (req, res) => {
  const searchTerm = req.body.word;

  model.searchAd(searchTerm)
    .then((rows) => {
      res.status(200).json({ result: rows });
    }, (err) => {
      console.log(err);
    });
});

router.post('/getContactInfo', (req, res) => {
  const theID = req.body.adsID;

  model.getContact(theID)
    .then((info) => {
      res.status(200).json({ contactInfo: info });
    }, (err) => {
      console.log(err);
    });
});

const reqAuth = (req, res, next) => {
  /** TODO: timeout */
  const user = req.session;
  if (user === undefined || user.loggedIn === false) {
    res.status(401).send('Unauthorized');
  }
  else {
    req.session._garbage = Date();
    req.session.touch();
    console.log('en touch');
    console.log(req.session.loggedIn);
  }
  next();

};


module.exports = { router, reqAuth };
