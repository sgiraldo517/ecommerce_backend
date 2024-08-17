import { Router } from 'express';
//! Import Controllers
import productsControllers from '../controllers/products.controllers.js'

const router = Router()

router.get('/', productsControllers.paginateProducts)


export default router