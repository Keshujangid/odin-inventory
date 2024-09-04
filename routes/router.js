const { Router } = require("express");
const controller = require("../controllers/controller");
const usersRouter = Router();
const upload = require('../middlewares/upload.middleware')
const validateFruit = require('../middlewares/fruitValidation');


usersRouter.get('/', controller.home)
usersRouter.get('/fruits/:id', controller.details)
usersRouter.get('/new', controller.showForm)
usersRouter.post('/submit', upload.single('f_img'),controller.multerImageValidation, validateFruit, controller.formData)
usersRouter.get('/family' , controller.getAllFamily)
usersRouter.get('/family/:id', controller.getFruitsByFamily)
usersRouter.get('/update/:id', controller.updateFruit)
usersRouter.post('/update/:id', validateFruit,controller.postUpdate)
module.exports = usersRouter;