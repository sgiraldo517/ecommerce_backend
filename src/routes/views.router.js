import { Router } from 'express';
//! Import Controller
import viewsController from '../controllers/views.controller.js'

const router = Router()

router.get('/products', viewsController.paginateProducts);

router.get('/carts/:cid', viewsController.paginateCart);


export default router;