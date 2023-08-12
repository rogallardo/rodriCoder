import express from "express";
import { productService } from "../../services/products.service.js";
import { cartService } from "../../services/carts.services.js";
import { checkIsAdmin, checkUser } from "../../middlewares/auth.js";
import { productsModel } from "../../DAO/memory/products.model.memory.js";


export const routerProductsView = express.Router()
export const routerCartView = express.Router()
export const routerAuthView = express.Router()
export const routerRealTimeProducts = express()


//render products
routerProductsView.get('/', checkUser, checkIsAdmin, async (req, res)=>{
    let {firstName, lastName, email, isAdmin} = req.session.user
    const user = {firstName, lastName, email, isAdmin}
    const originalURL = req.originalUrl
    let { page, limit, category, sort, order } = req.query
    const queries = {page, limit, category, sort, order, originalURL }
    let {error, msg, data, paginate} = await productService.getProducts(queries)  
    paginate.prevLink = paginate.hasPrevPage ? paginate.prevLink.replace('/api', '') : paginate.prevLink
    paginate.nextLink = paginate.hasNextPage ? paginate.nextLink.replace('/api', '') : paginate.nextLink
    if(page){
        paginate.prevLink = paginate.hasPrevPage ? originalURL.replace(`?page=${page}`, `?page=${paginate.prevPage}`) : null
        paginate.nextLink = paginate.hasNextPage ? originalURL.replace(`?page=${page}`, `?page=${paginate.nextPage}`) : null
    }
    
    res.render('products', {data, paginate, user})

})
routerProductsView.get('/:pid', async (req, res)=>{
    let { pid } = req.params
    let {error, msg, data} = await productService.getProductById(pid)

    res.render('productDetail', {data})
})
//render cart
routerCartView.get('/:cid', async (req, res)=>{
    let {cid} = req.params
    let {error, msg, data} = await cartService.getCart(cid)   
    res.render('cart', {data})
})
//render register
routerAuthView.get('/register', (req, res)=>{
    res.render('register')
})
//render login
routerAuthView.get('/login', (req, res)=>{
    res.render('login')
})
//render realTimeProducts
routerRealTimeProducts.get('/', async (req, res)=>{
    const socketServer = req.app.get('socketServer')
    socketServer.on('connection', async (socket)=>{
        console.log(`conectado con id ${socket.id}`)

        const allProducts = await productsModel.getProducts()
        socket.emit('primarychannel', {prods: allProducts})
        socket.on("primarychannel", async (msg)=>{                 
            let title = msg.title 
            let description = msg.description
            let code = msg.code
            let price = msg.price
            let status = msg.status
            let stock = msg.stock
            let category = msg.category
            let thumbnail = msg.thumbnail

            try {
                const adding = await productManager.addProduct(
                    title, description, code, price, status, stock, category, thumbnail)

                if(adding.validation === false){
                    socket.emit("primarychannel", adding.error )
                  
                }else{
                    const updatedProducts = await productManager.getProducts()
                    socket.emit("primarychannel", {msgSuccess:'Product added', prods: updatedProducts} )                    
                }    
               } catch (err) {
               console.log('error')
               }   
        })

        socket.on("msgdelete", async (id)=>{
            const deleteProduct = await productManager.deleteById(id)
            const updatedProducts = await productManager.getProducts()
            socket.emit("primarychannel", {msgSuccess:'Product deleted', prods: updatedProducts} )
        })
    })    
    return res.render('realTimeProducts')
})





