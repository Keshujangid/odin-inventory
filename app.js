require('dotenv').config()
const path = require('path')
const ejs = require("ejs")
const express = require("express")
const app = express();
const usersRouter = require("./routes/router")
// const multer = require('multer')
const port = 3000



//view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


//middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static(__dirname+'/public'));




// Routes
app.use('/', usersRouter);


// Global error-handling middleware
app.use((err, req, res, next) => {
  if (err) {
    console.error(err.stack); // Logs the error stack trace to the console
    res.status(500).render('error', { errors: [{ msg: 'An unexpected error occurred.' }] });
  } else {
    next();
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})