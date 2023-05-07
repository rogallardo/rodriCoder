import express from 'express';
import ProductManager from './ProductManager.js';
const app = express();
const port = 8080;
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//instancio la clase
const product = new ProductManager()

app.get("/products/:id", async (req, res) => {
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
      return res.status(404).json({
        status: 'error',
        msg: `product with id ${id} not found`,
        data: result
      })
    }
    //si el contenido esta vacio, indico el error y envio el msj
    
})

app.get("/products", async (req, res)=>{
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

app.get("*", (req, res) => {
  res.status(404).send("error, route not found");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});