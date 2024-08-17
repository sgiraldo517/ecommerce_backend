//! Creacion del servidor
import express, { json, urlencoded } from 'express'
import mongoose from './config/config.js';
import handlebars from 'express-handlebars'
import __dirname from './utils.js'

const app = express()
const PORT = 8080

//! Importar rutas
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'

//* Inicializacion del motor
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'));

//* Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/products/', productsRouter)
app.use('/api/carts/', cartsRouter)
app.use('/', viewsRouter)


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

