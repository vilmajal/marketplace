const path = require('path');
const bcrypt = require('bcrypt');

const sqlite3 = require('sqlite3').verbose();

const databasePath = path.join(__dirname, '..', 'db.sqlite');
const db = new sqlite3.Database(databasePath);

db.serialize(() => {
  const users = [[1,'Lisa', 'mango123', '070-7739033', 'lisa@kth.se'], [2,'Vilma', 'banan123', '070-344313', 'vilma@kth.se'], [3,'Luciano', 'apelsin123', '0705353533', 'zapata@kth.se']];
  db.run('DROP TABLE IF EXISTS users');
  db.run('DROP TABLE IF EXISTS ads');
  db.run('DROP TABLE IF EXISTS userDetails');

  db.run('CREATE TABLE users (userID INTEGER PRIMARY KEY, userName TEXT, userPass TEXT,telephone TEXT, email TEXT)');
  db.run('CREATE TABLE ads (aID INTEGER PRIMARY KEY, uID INTEGER, title TEXT, info TEXT, price INTEGER, type TEXT, imagePath TEXT, FOREIGN KEY(uID) REFERENCES users(userID))');
  // db.run('CREATE TABLE drafts (aID INTEGER PRIMARY KEY, uID INTEGER, title TEXT, info TEXT, price INTEGER, type TEXT)')

  const query = db.prepare('INSERT INTO users (userID,userName, userPass, telephone, email) VALUES (?, ?, ?, ?, ?)');

  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    bcrypt.hash(user[2], 10, (err, hash) => {
      if (err) { console.log(err); } else {
        query.run(user[0],user[1], hash, user[2], user[3]);
      }
    });
  }

  db.run('INSERT INTO ads (uID, title, info, price, type, imagePath) VALUES (1, "Spännande deckare", "Deckaren Den femte kvinnan, skriven av Henning Mankell, i prima skick", 10, "Fritid", "../../../images/1.jpeg")');
  db.run('INSERT INTO ads (uID, title, info, price, type, imagePath) VALUES (3, "Vacker tavla", "Säljer den vackra Stjärnenatt målad av Vincent van Gogh. Tavlan är i fint skick, ny ram är köpt.", 2000, "Inredning", "../../../images/2.jpeg")');
  db.run('INSERT INTO ads (uID, title, info, price, type, imagePath) VALUES (2, "Barnvagn", "Kronans sittvagn Sulky S med svängbara hjul, liggläge. Regnskydd medföljer. Fin vagn i mycket fint skick! Finns i farsta.", 1500, "Personligt", "../../../images/vagn.png")');
  db.run('INSERT INTO ads (uID, title, info, price, type, imagePath) VALUES (2, "Golfklubba XXIO X hybrid 5 (23°)", "Säljer en nästintill ny XXIO X hybrid 5 på 23°. Klubban kommer med ett stiff skaft. Extremt förlåtande med mycket kick i träffen och genererar fin höjd och spinn. Den är i nyskick och kostade 3200 ny", 2000, "Sport", "../../../images/klubba.png")');
  db.run('INSERT INTO ads (uID, title, info, price, type, imagePath) VALUES (3, "Cykel", "Hej, Säljer cykel i fint skick men enda problemet är att växeln fungerar inte måste fixas, man kan cykla på en växel men går inte växla.", 600, "Sport", "../../../images/cykel.png")');
  db.run('INSERT INTO ads (uID, title, info, price, type, imagePath) VALUES (1, "Fender Jaguar 1965", "Ombandad med korrekta vintageband & mycket lättspelad, rena toner bra set upp, bytta stämskruvar, all elektronik fungerar. Låter riktigt bra både utan & med förstärkare.", 36900, "Fritid", "../../images/fenderpic.png")');

  /*   const brr = db.prepare('SELECT * FROM users');
      brr.all((err, res) => {
          res.forEach((row) => {
              console.log(`${row.userID}, ${row.userName}, ${row.userPass}`)
          });
      }); */

  const aa = db.prepare('SELECT * FROM ads');
  aa.all((err, ress) => {
    ress.forEach((row) => {
      console.log(`${row.aID}, ${row.uID}, ${row.title}, ${row.info}, ${row.price}, ${row.type}`);
    });
  });
  console.log('Database up');
});

module.exports = db;
