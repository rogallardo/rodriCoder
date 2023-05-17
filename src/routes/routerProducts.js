import  express  from "express";
import ProductManager from "../controllers/ProductManager.js";
//defino el router
export const  routerProducts = express.Router()

//instancio la clase
const product = new ProductManager()

routerProducts.get('/', async (req, res)=>{
      //guardo la query en una variable y la paso a formato number
      const limit = Number(req.query.limit)
      if(req.query && limit){
          let products = await product.getProducts()
          //si el limite indicado en la query es mayor a 0 o igual o mayor al largo del array:
          if (limit > 0 && limit <= products.length){
            //procedo a igualar el largo del array con el limite indicado
            products.length = limit
          }
          // devuelvo el array acorde al limite especificado
          return res.json({
              status: 'success',
              msg: `The limit of sended products is ${limit}`,
              data: products
          })
      }else{
        //si no hay query de limite, devuelvo el array completo
          return res.json({
              status: 'success',
              msg: 'All products sended',
              data: await product.getProducts()
          })
      }
})
routerProducts.get("/:id", async (req, res) => {
  //guardo el id de los params en una variable
    const id = Number(req.params.id)
    //busco el id mediante el metodo de la clase
    const result = await product.getProductById(id)
    //si hay resultado devuelvo el producto
    if(result.length > 0){
      return res.json({
        status: 'success',
        msg: 'product sended',
        data: result
    })
    }else{
    //si el contenido esta vacio, indico el error y envio el msj
      return res.status(404).json({
        status: 'error',
        msg: `product with id ${id} not found`,
        data: result
      })
    }   
})
routerProducts.post('/', async (req, res)=>{
    let title = req.body.title
    let description = req.body.description
    let price = req.body.price
    let thumbnail = req.body.thumbnail
    let code = req.body.code
    let stock = req.body.stock
    let category = req.body.category
    let status = req.body.status
   try {
    const adding = await  product.addProduct(
        title, // “producto prueba” 
        description, //”Este es un producto prueba”
        code, //abc123”,
        price, //200,
        status, 
        stock, //25
        category,//electro
        thumbnail, //”Sin imagen”
    )
    if(adding.validation === false){
        return res.status(404).json({
            status: 'error adding product',
            msg: adding.error,
            data: {}
        })
    } else {
         return res.json({
              status: 'success',
              msg:'product added',
              data: req.body
          })
    }
    
   } catch (error) {
    res.json({
        status: 'failed',
        msg: "error",   
    })
   }
})
routerProducts.put('/:pid', async (req, res)=>{
    let id = Number(req.params.pid)
    let title = req.body.title
    let description = req.body.description
    let price = req.body.price
    let thumbnail = req.body.thumbnail
    let code = req.body.code
    let stock = req.body.stock
    let category = req.body.category
    let status = req.body.status
   
   try {
    const adding = await product.updateProduct(
        id,
        title, // “producto prueba” 
        description, //”Este es un producto prueba”
        code, //abc123”,
        price, //200,
        status, 
        stock, //25
        category,//electro
        thumbnail, //”Sin imagen”
    )
    if(adding.validation === false){
        return res.status(404).json({
            status: 'error updating product',
            msg: adding.error,
            data: {}
        })
    } else {
         return res.json({
              status: 'success',
              msg:'product updated',
             data: adding.data
          })
    }
    
   } catch (error) {
    res.status(404).json({
        status: 'failed',
        msg: 'error'   
    })
   }
})
routerProducts.delete("/:pid", async (req, res) => {
    //guardo el id de los params en una variable
      const id = Number(req.params.pid)
      //busco el id mediante el metodo de la clase
      const result = await product.deleteById(id)
      //si hay resultado devuelvo el producto
      if(result.deleted){
        return res.json({
          status: 'success',
          msg: `Product with id ${id} deleted`,
      })
      }else{
      //si el contenido esta vacio, indico el error y envio el msj
        return res.status(404).json({
          status: 'error not found',
          msg: result.error,
        })
      }   
})
