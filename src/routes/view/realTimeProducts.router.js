import  express  from "express";
//import ProductManager from "../DAO/ProductManager.js";
// export const routerRealTimeProducts = express.Router()



// const product = new ProductManager()

// routerRealTimeProducts.get('/', async (req, res)=>{
  
//     const socketServer = req.app.get('socketServer')
//     socketServer.on('connection', async (socket)=>{
//         console.log(`conectado con id ${socket.id}`)

//         const allProducts = await product.getProducts()
//         socket.emit('primarychannel', {prods: allProducts})
//         socket.on("primarychannel", async (msg)=>{                 
//             let title = msg.title 
//             let description = msg.description
//             let code = msg.code
//             let price = msg.price
//             let status = msg.status
//             let stock = msg.stock
//             let category = msg.category
//             let thumbnail = msg.thumbnail

//             try {
//                 const adding = await product.addProduct(
//                     title, description, code, price, status, stock, category, thumbnail)

//                 if(adding.validation === false){
//                     socket.emit("primarychannel", adding.error )
                  
//                 }else{
//                     const updatedProducts = await product.getProducts()
//                     socket.emit("primarychannel", {msgSuccess:'Product added', prods: updatedProducts} )                    
//                 }    
//                } catch (err) {
//                console.log('error')
//                }   
//         })

//         socket.on("msgdelete", async (id)=>{
//             const deleteProduct = await product.deleteById(id)
//             const updatedProducts = await product.getProducts()
//             socket.emit("primarychannel", {msgSuccess:'Product deleted', prods: updatedProducts} )
//         })
//     })    
//     return res.render('realTimeProducts')
// })



