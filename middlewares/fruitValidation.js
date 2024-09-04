const { check } = require('express-validator');

const validateFruit = [
  check('name').notEmpty().withMessage('Name is required'),
  check('family').notEmpty().withMessage('Family is required'),
  check('f_order').notEmpty().withMessage('Order is required'),
  check('genus').notEmpty().withMessage('Genus is required'),
  check('calories').notEmpty().withMessage('calories is required'),
  check('fat').notEmpty().withMessage('fat is required'),
  check('sugar').notEmpty().withMessage('sugar is required'),
  check('carbohydrates').notEmpty().withMessage('carbohydrates is required'),
  check('protein').notEmpty().withMessage('protein is required'),

];

module.exports = validateFruit;
