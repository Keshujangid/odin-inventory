const query = require('../db/query')
const path = require('path');
const cloudUpload = require('../utils/Cloudinary');
const { validationResult } = require('express-validator');
const validateFruit = require('../middlewares/fruitValidation');
const { unlink } = require('node:fs')
const prompt = require('prompt-sync')({ sigint: true });

async function home(req, res) {

  const data = await query.getData();
  res.render('index', { fruits: data });
  res.end();
}

async function getAllFamily(req , res) {
  const data = await query.getFruitsFamily();
  res.render('category' , {data:data})
}


async function getFruitsByFamily(req ,res) {
  const familyName = req.params.id;
  const data =  await query.getByFamilyName(familyName)
  res.render('index', { fruits: data });
  res.end();
}


async function details(req, res) {
  const fruitId = req.params.id

  try {
    const fruitsDetail = await query.getById(fruitId);
    if (fruitsDetail) {
      res.render('details', { fruitsDetail });
    } else {
      res.status(404).send('Fruit not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}


function showForm(req, res) {
  const mode = 'new';  // Default to 'new' mode for adding a fruit
  const data = {};     // Default to an empty object for new fruit data

  res.render('form', { data, mode });
}

function multerImageValidation(req, res, next) {
  if (!req.file) {
    return res.render('error', { errors: [{ msg: 'Please upload a valid image file.' }] });
  }
  next();
}



async function formData(req, res) {

  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('error', { errors: errors.array() });
    }

    // uploading to cloud 
    const result = await cloudUpload.cloudUpload(req.file.path)

    // storing into DB
    await query.storeInDb(req.body , result.url);

    //deleting file from local storage
    unlink(req.file.path, (err) => {
      if (err) throw err;
      console.log(req.file.path, `was deleted`);
    });

    res.redirect('/')
  } catch (error) {
    console.log('upload error', error);
    // Render error.ejs in case of an exception
    res.status(500).render('error', { errors: [{ msg: 'An unexpected error occurred.' }] });
  }
}


async function updateFruit(req, res) {
  const id = req.params.id;
  const data = await query.getById(id);
  
  if (data) {
    res.render('form', { data, mode: 'edit' });
  } else {
    res.status(404).render('error', { errors: [{ msg: 'Fruit not found.' }] });
  }
}

async function postUpdate(req , res) {
  try {
    const userInput = prompt("Please enter admin password:");
    if (userInput !== process.env.ADMIN_KEY ) return res.redirect('/');
      
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('error', { errors: errors.array() });
    }
    await query.updateFruit(req.params.id , req.body)
  } catch (error) {
    console.log('upload error', error);
    res.status(500).render('error', { errors: [{ msg: 'An unexpected error occurred.' }] });
  }
  res.redirect(`/fruits/${req.params.id}`)
}

// async function deleteFruit(req , res) {
//   const id = req.params.id;

// }

module.exports = {
  home,
  details,
  showForm,
  formData,
  multerImageValidation,
  getAllFamily,
  getFruitsByFamily,
  updateFruit,
  postUpdate
}