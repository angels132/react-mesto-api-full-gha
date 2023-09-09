const router = require('express').Router();
const {
  getUsers, getUserById, updateUser, updateAvatar, getUserInfo,
} = require('../controllers/users');
const {
  validateGetUsers,
  validateGetUserInfo,
  validateGetUserById,
  validateUpdateUser,
  validateUpdateAvatar,
} = require('../middlewares/validations');
const auth = require('../middlewares/auth');

router.use(auth);
router.get('/', validateGetUsers, getUsers);
router.get('/me', validateGetUserInfo, getUserInfo);
router.get('/:userId', validateGetUserById, getUserById);
router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
