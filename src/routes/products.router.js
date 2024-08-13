import { Router } from 'express';

//! Import productsModel
import productsModel from '../models/products.models.js'

const router = Router()

router.get('/', async(req, res) => {
    try {
        let limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;
        let sort = req.query.sort;
        let category = req.query.category;
        let disponibilidad = parseInt(req.query.disponibilidad);

        const query = {};
        const options = { page, limit };

        if (sort) options.sort = { price: sort === 'asc' ? 'asc' : 'desc' };
        if(category) query.category=category
        if(disponibilidad) query.stock= disponibilidad
        
        let productos = await productsModel.paginate(query, options)
        productos.status = 'success'
        productos.prevLink = productos.hasPrevPage?`http://localhost:8080/api/products?page=${productos.prevPage}`:null;
        productos.nextLink = productos.hasNextPage?`http://localhost:8080/api/products?page=${productos.nextPage}`:null;
        res.json(productos)
    } catch (e) {
        res.status(500).json( { status: 'error', payload: e.message});
    }
})


export default router