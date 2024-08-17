//! Import Models
import productsModel from '../dao/models/products.models.js';
import cartsModel from '../dao/models/carts.models.js'

async function paginateProducts(req, res) {
    try {
        let limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;
        let sort = req.query.sort;
        let category = req.query.category;
        let disponibilidad = parseInt(req.query.disponibilidad);

        const query = {};
        const options = { page, limit, lean:true };

        if (sort) options.sort = { price: sort === 'asc' ? 'asc' : 'desc' };
        if(category) query.category = category;
        if(disponibilidad) query.stock = disponibilidad;

        let productos = await productsModel.paginate(query, options);
        productos.status = 'success',
        productos.prevLink = productos.hasPrevPage?`http://localhost:8080/products?page=${productos.prevPage}&limit=${limit}`:null;
        productos.nextLink = productos.hasNextPage?`http://localhost:8080/products?page=${productos.nextPage}&limit=${limit}`:null; 
        console.log(productos);
        res.render('products',  productos ); 
    } catch (e) {
        res.status(500).json({ status: 'error', payload: e.message });
    }
}

async function paginateCart(req, res) {
    const cartId = req.params.cid
    try {
        let limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;

        const carritoBuscado = await cartsModel.findById(cartId).populate('products.product').lean();
        console.log(carritoBuscado.products);
        
        if (!carritoBuscado) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        let productosCarrito = carritoBuscado.products
        const totalPages = Math.ceil(productosCarrito.length / limit)
        const result = {
            status:'success',
            payload: productosCarrito.slice((page - 1) * limit, page * limit),
            totalPages: totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page: page,
            hasPrevPage: page > 1? true : false, 
            hasNextPage: Math.ceil(productosCarrito.length / limit) > 1? true : false, 
            prevLink: page > 1 ? `http://localhost:8080/api/carts/${cartId}?page=${page - 1}&limit=${limit}` : null,
            nextLink: page < totalPages ? `http://localhost:8080/api/carts/${cartId}?page=${page + 1}&limit=${limit}` : null,
        };
        console.log(result);    
        res.render('carts',   result  ); 
    } catch (e) {
        res.status(500).json({ status: 'error', payload: e.message });
    }
}

export default {
    paginateProducts,
    paginateCart
}