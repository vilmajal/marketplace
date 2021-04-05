const bcrypt = require('bcrypt');
const db = require('./database');

// Will be initialized in the exports.init function
exports.io = undefined;

/**
 * Initialize the model
 * @param { { io: SocketIO.Server} } config - The configurations needed to initialize the model.
 * @returns {void}
 */
exports.init = ({ io }) => {
  exports.io = io;
};

exports.getAllAds = () => new Promise((resolve, reject) => {
  db.serialize(() => {
    const query = db.prepare('SELECT * FROM ads');
    query.all((err, rows) => {
      if (err) { reject(err); }
      const ads = [];
      rows.forEach((row) => {
        ads.push(row);
      });
      resolve(ads);
    });
  });
});

exports.getAnnons = (id) => new Promise((resolve, reject) => {
  db.serialize(() => {
    const query = db.prepare('SELECT * FROM ads WHERE aID = ?');
    query.all(id, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
});

exports.tryLogin = (usrnm, pswrd) => new Promise((resolve, reject) => {
  // const pass = "";
  db.serialize(() => {
    const query = db.prepare('SELECT * FROM users WHERE userName = ?');
    query.each(usrnm, (err, row) => {
      if (err) { reject(err); }

      bcrypt.compare(pswrd, row.userPass, (error, result) => {
        if (result) { resolve(true); } else { resolve(false); }
      });
    });
  });
});

exports.registerCheck = (anvandarnamn, mejl) => new Promise((resolve, reject) => {
  db.serialize(() => {
    const query = db.prepare('SELECT * FROM users WHERE userName = ? OR email = ?');
    query.all(anvandarnamn, mejl, (error, row) => {
      // kollar om mejl eller namn är taget
      if (error) { reject(error); } else if (row.length > 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
});

exports.newUser = (username, email, password, phonenr) => new Promise(() => {
  const hash = bcrypt.hashSync(password, 10);
  const query = 'INSERT INTO users (userName, userPass, telephone, email) VALUES (?, ?, ?, ?)';
  // const query2 = 'INSERT INTO userDetails (userName, telephone, email) VALUES (?, ?, ?)';
  db.run(query, username, hash, phonenr, email);
  // db.run(query2, username, phonenr, email);
});

exports.userInfo = (usrnm) => new Promise((resolve, reject) => {
  db.serialize(() => {
    const query = db.prepare('SELECT * FROM users WHERE userName = ?');
    query.each(usrnm, (err, row) => {
      if (err) { reject(err); }
      resolve(row);
    });
  });
});

exports.userAds = (id) => new Promise((resolve, reject) => {
  db.serialize(() => {
    const query = db.prepare('SELECT * FROM ads WHERE uID = ?');
    query.all(id, (err, rows) => {
      if (err) { reject(err); }
      resolve(rows);
    });
  });
});

exports.userID = (usrnm) => new Promise((resolve, reject) => {
  db.serialize(() => {
    const query = db.prepare('SELECT userID from users WHERE userName = ?');
    query.each(usrnm, (err, row) => {
      if (err) { reject(err); }
      resolve(row.userID);
    });
  });
});

exports.changeUser = (uname, newTel, newMail) => new Promise((resolve, reject) => {
  db.serialize(() => {
    const query = db.prepare('UPDATE users SET telephone = ?, email = ? WHERE userName = ?');
    query.run(newTel, newMail, uname, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve('update sucess');
      }
    });
  });
});

exports.searchAd = (term) => new Promise((resolve, reject) => {
  const regTerm = `%${term}%`;
  db.serialize(() => {
    const query = db.prepare('SELECT * FROM ads WHERE info LIKE ? OR title LIKE ?');
    query.all(regTerm, regTerm, (err, rows) => {
      if (err) { reject(err); }
      resolve(rows);
    });
  });
});

exports.createAnnons = (annons, userid, imgp) => new Promise((resolve, reject) => {
  const titlee = annons.title;
  const pricee = annons.price;
  const typee = annons.type;
  const information = annons.info;
  const imgPath = `/images/${imgp}`;

  db.serialize(() => {
    const query = db.prepare('INSERT INTO ads (uID, title, info, price, type, imagePath) VALUES (?,?,?,?,?,?)');
    query.all(userid, titlee, information, pricee, typee, imgPath, (err) => {
      if (err) {
        reject(err);
      }
    });
    const uID = db.prepare('SELECT last_insert_rowid()');
    uID.all((err, answer) => {
      const annonsID = answer[0]['last_insert_rowid()'];
      console.log('heheh ID? :', annonsID);
      exports.io.emit('newAd', annonsID);
      resolve();
    });
  });
});

exports.getContact = (aID) => new Promise((resolve, reject) => {
  db.serialize(() => {
    const query = db.prepare('Select telephone,email from users where userID = ?')
    query.all(aID, (err, answer) => {
      if (err) {
        reject(err);
      }
      resolve(answer);
    })
  })

})

exports.saveDraft = (draftObject, userID) => new Promise((resolve, reject) => {
  db.serialize(() => {
    const query = db.prepare('UPDATE drafts SET title = ?, info = ?, price = ?, type = ? WHERE uID = ?')
    query.all(draftObject.title, draftObject.info, draftObject.price, draftObject.type, userID, (err, answer) => {
      if (err) {
        reject(err);
      }
      resolve(answer);
    });
  })
})

exports.createDraft = (userID) => new Promise((resolve, reject) => {
  db.serialize(() => {
    const query = db.prepare('INSERT into drafts (uID,title,info,price,type) values (?,null,null,null,null)');
    query.all(userID, (err, answer) => {
      if (err) {
        reject(err);
      }
      resolve(answer);
    })
  })
})

exports.checkDraft = (userID) => new Promise((resolve, reject) => {
  db.serialize(() => {
    const query = db.prepare('select * from drafts where uID = ?');
    query.all(userID, (err, answer) => {
      if (err) {
        reject(err);
      }
      resolve(answer);
    })
  })
})

exports.deleteDraft = (userID) => new Promise((resolve, reject) => {
  db.serialize(() => {
    const query = db.prepare('delete from drafts where uID = ?');
    query.run(userID, err => {
      if (err) {
        reject(err);
      }
      console.log('success');
    })
  })
})