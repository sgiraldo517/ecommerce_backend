//! Import cartsModel
import cartsModel from '../dao/models/carts.models.js'

async function getCart(req, res) {
    try {
        let cartId = req.params.cid;
        const carritoBuscado = await cartsModel.findById(cartId).populate('products.product'); // Populate the product details

        if (!carritoBuscado) {
            return res.status(404).send({ result: "failure", message: "Carrito no encontrado" });
        }

        res.status(200).send({ result: "success", payload: carritoBuscado });
    } catch (e) {
        res.status(500).send("Error al encontrar carrito: " + e.message);
    }
} 

async function createCart(req, res) {
    try {
        await cartsModel.create({})
        const lastCart = await cartsModel.findOne().sort({ _id: -1 })
        return res.status(200).send({result: "success", payload: lastCart})
    } catch (e) {
        res.status(500).send("Error al agregar producto: " + e.message);
    }
}

async function updateCart(req, res) {
    const cartId = req.params.cid
    const productId = req.params.pid
    try {
        let carrito = await cartsModel.findById(cartId);
        if (!carrito) {
            return res.status(404).send({ result: "failure", message: "Carrito no encontrado" });
        }
        const productIndex = carrito.products.findIndex(p => p.product == productId);
        if (productIndex !== -1) {
            carrito.products[productIndex].quantity++;
        } else {
            carrito.products.push({ product: productId, quantity: 1 });
        }
        carrito = await carrito.save();
        return res.status(200).send({ result: "success", payload: carrito });
    } catch (e) {
        res.status(500).send("Error updating cart: " + e.message);
    }
}

async function deleteProduct(req, res) {
    const cartId = req.params.cid
    const productId = req.params.pid
    try {
        let carrito = await cartsModel.findById(cartId);
        if (!carrito) {
            return res.status(404).send({ result: "failure", message: "Carrito no encontrado" });
        }
        const productIndex = carrito.products.findIndex(p => p.product == productId);
        if (productIndex === -1) {
            return res.status(404).send({ result: "failure", message: "Producto no encontrado en el carrito" });
        }
        carrito.products.splice(productIndex, 1);
        carrito = await carrito.save();
        return res.status(200).send({ result: "success", payload: carrito });
    } catch (e) {
        res.status(500).send("Error updating cart: " + e.message);
    }
}

async function paginateCart(req, res) {
    const cartId = req.params.cid
    try {
        let limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;

        const carritoBuscado = await cartsModel.findById(cartId).populate('products.product');
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
        }
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ status: 'error', payload: e.message });
    }
}

async function updateProductQuantity(req, res) {
    const cartId = req.params.cid
    const productId = req.params.pid
    const { quantity } = req.body
    
    try {
        let carrito = await cartsModel.findById(cartId);
        if (!carrito) {
            return res.status(404).send({ result: "failure", message: "Carrito no encontrado" });
        }
        const productIndex = carrito.products.findIndex(p => p.product == productId);
        if (productIndex !== -1) {
            carrito.products[productIndex].quantity = quantity;
        } else {
            carrito.products.push({ product: productId, quantity: quantity });
        }
        carrito = await carrito.save();
        return res.status(200).send({ result: "success", payload: carrito });
    } catch (e) {
        res.status(500).json({ status: 'error', payload: e.message });
    }
}

async function deleteAllProducts(req, res) {
    const cartId = req.params.cid
    try {
        let carrito = await cartsModel.findById(cartId);
        if (!carrito) {
            return res.status(404).send({ result: "failure", message: "Carrito no encontrado" });
        }  
        carrito.products = []
        carrito = await carrito.save();
        return res.status(200).send({ result: "success", payload: carrito });
    } catch (e) {
        res.status(500).send("Error updating cart: " + e.message);
    }
}

export default {
    getCart,
    createCart,
    updateCart,
    deleteProduct,
    paginateCart,
    updateProductQuantity,
    deleteAllProducts
}

