import express from 'express';
import productsController from '../../controllers/v1/products-controller';

const router = express.Router();

router.post('/create', productsController.createProduct);
router.get('/get-all', productsController.getProducs);
router.get('/get-by-user/:userId', productsController.getProducsByUser);

export default router;
