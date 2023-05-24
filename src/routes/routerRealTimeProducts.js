import  express  from "express";
import ProductManager from "../controllers/ProductManager.js";
export const routerRealTimeProducts = express.Router()

//instancio la clase

const product = new ProductManager()
//declaro el router con el metodo get
routerRealTimeProducts.get('/', async (req, res)=>{
    //inicio el servidor socket
    const socketServer = req.app.get('socketServer')
    socketServer.on('connection', async (socket)=>{
        console.log(`conectado con id ${socket.id}`)
        //envio la lista inicial de productos
        const allProducts = await product.getProducts()
        socket.emit('msgtoback', {prods: allProducts})
        //si se agrega un producto, lo recibo desde el front y guardo las variables
        socket.on("msgtoback", async (msg)=>{                 
            let title = msg.title 
            let description = msg.description
            let code = msg.code
            let price = msg.price
            let status = msg.status
            let stock = msg.stock
            let category = msg.category
            let thumbnail = msg.thumbnail
            //agrego el producto
            try {
                const adding = await product.addProduct(
                    title, description, code, price, status, stock, category, thumbnail)
                //si hay error al agregar, muestro el error (dicho mensaje viene de la validacion)  
                if(adding.validation === false){
                    socket.emit("msgtoback", adding.error )
                //si no hay error agrego el producto                      
                }else{
                    const updatedProducts = await product.getProducts()
                    socket.emit("msgtoback", {msgSuccess:'Producto agregado', prods: updatedProducts} )                    
                }    
               } catch (err) {
               console.log('error')
               }   
        })
        //escucho si el front decide eliminar
        socket.on("msgdelete", async (id)=>{
            const deleteProduct = await product.deleteById(id)
            const updatedProducts = await product.getProducts()
            socket.emit("msgtoback", {msgSuccess:'Producto eliminado', prods: updatedProducts} )
        })
    })    
    return res.render('realTimeProducts')
})



