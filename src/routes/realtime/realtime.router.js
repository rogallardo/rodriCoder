import express from "express";
import { productService } from "../../services/products.service.js";
import { productsModel } from "../../DAO/mongodb/products.model.js";
export const routerRealTimeProducts = express.Router()

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