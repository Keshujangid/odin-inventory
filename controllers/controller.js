const query = require('../db/query')
const path = require('path');
const cloudUpload = require('../utils/Cloudinary');
const { validationResult } = require('express-validator');
const validateFruit = require('../middlewares/fruitValidation');
const { unlink } = require('node:fs')

async function home(req, res) {

  const data = await query.getData();
  res.render('index', { fruits: data });
  res.end();
}

async function getAllFamily(req , res) {
  const data = await query.getFruitsFamily();
  console.log(data);
  res.render('category' , {data:data})
}


async function getFruitsByFamily(req ,res) {
  const familyName = req.params.id;
  const data =  await query.getByFamilyName(familyName)
  res.render('index', { fruits: data });
  // console.log(result);
  res.end();
}


async function details(req, res) {
  const fruitId = req.params.id

  try {
    const fruitsDetail = await query.getById(fruitId);
    if (fruitsDetail) {
      res.render('details', { fruitsDetail });
      // console.log(fruitsDetail);
      // res.end();
    } else {
      res.status(404).send('Fruit not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}


function showForm(req, res) {
  res.render('form');
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
    console.log(req.body);
    console.log(req.file);

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
  // res.redirect('/')
}


module.exports = {
  home,
  details,
  showForm,
  formData,
  multerImageValidation,
  getAllFamily,
  getFruitsByFamily
}