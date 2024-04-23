const express = require('express');
const router = express.Router()

//! Import clase ProductManager
const ProductManager = require('../../utils/productManager.js')
const productManager = new ProductManager()

//! Endpoints

router.get('/', async(req, res) => {
    try {
        let limit = parseInt(req.query.limit)
        const arrayProductos = await productManager.getProducts()
        if(!limit) {
            res.json(arrayProductos)
        } else {
            const arrayFiltrado = arrayProductos.slice(0, limit)
            res.json(arrayFiltrado)
        }
    } catch (e) {
        res.status(500).send( "Error al consultar productos " + e.message);
    }
})

router.get('/:pid', async(req, res) =>{
    try {
        let productId = parseInt(req.params.pid)
        const productoBuscado = await productManager.getProductById(productId)
        if (!productoBuscado) {
            res.status(404).send(`Error: El producto con el id ${productId} no existe en la base de datos.`);
            return; 
        }
        res.json(productoBuscado);
    } catch (e) {
        res.status(500).send( "Error al encontrar producto " + e.message);
    }
})

router.post('/', async(req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnail } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).send("Error: faltan algunas propiedades del producto obligatorias");
        }
        await productManager.addProduct(title, description, code, price, status, stock, category, thumbnail);
        return res.status(200).send(`El producto ${title} fue agregado exitosamente`)
    } catch (e) {
        res.status(500).send("Error al agregar producto: " + e.message);
    }
})

router.put('/:pid', async(req, res) =>{
    try {
        let productId = parseInt(req.params.pid)
        const newData = req.body;
        const productoActualizado = await productManager.updateProduct(productId, newData)
        res.status(200).send(productoActualizado)
    } catch (e) {
        res.status(500).send( "Error al actualizar el producto " + e.message);
    }
})

router.delete('/:pid', async(req, res) =>{
    try {
        let productId = parseInt(req.params.pid)
        const productoEliminado = await productManager.deleteProduct(productId)
        res.status(200).send(productoEliminado)
    } catch (e) {
        res.status(500).send( "Error al eliminar el producto " + e.message);
    }
})


module.exports = router