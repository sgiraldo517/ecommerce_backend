//! Creacion del servidor
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'

dotenv.config()


const app = express()
const PORT = 8080

//! Importar rutas
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'

//! Conexion a la base de datos
mongoose.connect(process.env.DATABASE_URL)
    .then(() => { console.log("Conectado a la base de datos") })
    .catch(error => console.error("Error en la conexion", error))

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

