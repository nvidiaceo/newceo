import express from 'express';
import { isAuth, isValidHostaname, isAdmin } from '../../middlewares/auth';
import usersController from '../../controllers/v1/users-controller';

const router = express.Router();

router.post('/login', usersController.login);
router.post('/create', usersController.createUser);
router.post('/update', isValidHostaname, isAuth, usersController.updateUser);
router.post('/delete', isAuth, isAdmin, usersController.deleteUser);
router.get('/get-all', isAuth, isAdmin, usersController.getUsers);

export default router;
