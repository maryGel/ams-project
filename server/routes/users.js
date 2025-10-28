import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {

  const sqlInsert = "INSERT INTO users_access (username, passw) VALUES (?, ?)";
  const username = req.body.username;
  const passw = req.body.passw;

  db.query(sqlInsert, [username,passw], (err, result) => { 
    if (err) {
      console.log(err);
      res.status(500).send("Error inserting user");
    } else {
      res.status(200).send("User inserted successfully");
    }
  });
})

router.get('/new', (req, res) => {
  res.send("users new form");
})

export default router;