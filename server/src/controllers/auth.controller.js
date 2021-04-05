const express = require('express');
const path = require('path');
const multer = require('multer');
const model = require('../model.js');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, '../client/dist/images');
    },
    filename(req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
  }),
});

// Get profileinfo
router.get('/profileInfo', (req, res) => {
  const username = req.session.usern;
  model.userInfo(username)
    .then((data) => {
      res.status(200).json({
        name: username,
        info: data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/updateUser', (req, res) => {
  const { mail } = req.body;
  const tel = req.body.tele;
  const user = req.session.usern;

  console.log(user, mail, tel);

  model.changeUser(user, tel, mail)
    .then(() => {
      console.log('uppdaterat');
      model.userInfo(user)
        .then((data) => {
          res.status(200).json({
            name: user,
            info: data,
          });
        });
    }, (err) => {
      console.log(err);
    });
});

router.get('/userAds', (req, res) => {
  if (req.session.usern === undefined) {
    res.status(401).send('Unauthorized. Login before trying this.');
  } else {
    const username = req.session.usern;
    console.log('DETTA ÄR NUVARANDE ANVÄNDARE: ', username);
    model.userID(username)
      .then((uID) => {
        console.log(uID);
        model.userAds(uID)
          .then((data) => {
            res.status(200).json({
              ads: data,
            });
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(`Error logging out: ${err}`);
    res.clearCookie('cookieDough').status(200).send('Cleared cookie');
  });
});

router.post('/newAnnons', upload.single('formImg'), (req, res) => { // ist för single, testa .any() för att få all form data
  const name = req.session.usern;
  const imgd = req.file.filename;
  const annons = {
    title: req.body.title, info: req.body.info, price: req.body.price, type: req.body.type,
  };
  console.log('hello?');

  model.userID(name)
    .then((uID) => {
      model.createAnnons(annons, uID, imgd);
      res.status(200).send(req.file);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/draftAd', (req, res) => {
  const draftAd = req.body.draftAd;
  const userID = req.body.userID;
  model.saveDraft(draftAd, userID)
    .then(res.status(200));
});

router.post('/createDraft', (req, res) => {
  const userID = req.body.fisk;
  console.log()
  model.createDraft(userID)
    .then(console.log('created new draft'));
});

router.post('/checkDraft', (req,res) => {
  const userID = req.body.fisk;
  model.checkDraft(userID)
    .then((data) => {
      res.send(data);
    })
})

router.post('/deleteDraft', (req, res) => {
  const userID = req.body.theID;
  model.deleteDraft(userID);

})

module.exports = { router };
