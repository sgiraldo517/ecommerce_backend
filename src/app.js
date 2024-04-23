//! Creacion del servidor
const express = require('express')
const path = require('path')
const app = express()
const PORT = 8080

//! Importar rutas
const productsRouter = require('./routes/products.router')
const cartsRouter = require('./routes/carts.router')

//* Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products/', productsRouter)
app.use('/api/carts/', cartsRouter)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

