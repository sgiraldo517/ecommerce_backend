import { Router } from 'express';
//! Import controllers
import cartControllers from '../controllers/carts.controllers.js'

const router = Router()

//! Endpoints
router.get('/:cid', cartControllers.getCart);

router.post('/', cartControllers.createCart)

router.post('/:cid/products/:pid', cartControllers.updateCart)

router.delete('/:cid/products/:pid', cartControllers.deleteProduct) 

router.put('/:cid', cartControllers.paginateCart) 

router.put('/:cid/products/:pid', cartControllers.updateProductQuantity) 

router.delete('/:cid', cartControllers.deleteAllProducts) 

export default router