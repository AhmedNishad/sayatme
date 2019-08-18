let express = require('express')
let router = express.Router()

const userController = require('../controllers/user_controller')

router.get('/', userController.get_users)

router.get('/:id', userController.get_user_sayats)

router.get('/:userid/:sayatid/interact', userController.sayat_interact)

router.post('/:id', userController.create_user_sayat)


router.get('/create/user', userController.create_user_get)
router.post('/create/user', userController.create_user_post)

module.exports = router;
