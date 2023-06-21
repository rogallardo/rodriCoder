import express from "express";
import { productService } from "../services/products.service.js";
export const routerProducts = express.Router()

routerProducts.get('/', async (req, res) => {
  try {
    let { page, limit, category } = req.query
    const queries = {page, limit}
    let {error, msg, data} = await productService.getProducts(queries) 
      return res.render('home', {data})
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: true,
      msg: "Error in server",
      data: {}
    })
  }

})
routerProducts.get('/:id', async (req, res) => {
  try {
    let { id } = req.params
    let { error, msg, data } = await productService.getProductById(id)
    if (error) {
      return res.status(401).json({
        error,
        msg,
        data
      })
    } else {
      res.status(200).json({
        error,
        msg,
        data
      })
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: "Error in server",
      data: {}
    })
  }
})
routerProducts.post("/", async (req, res) => {
  try {
    let { title, description, code, price, status, stock, category, thumbnail } = req.body
    const newProduct = {title, description, code, price, status, stock,category, thumbnail}
    let { error, msg, data } = await productService.createProduct(newProduct)
    if (error) {
      return res.status(500).json({
        error,
        msg,
        data
      })
    } else {
      res.status(200).json({
        error,
        msg,
        data
      })
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: "Error in server",
      data: {}
    })
  }
})
routerProducts.put('/:id', async (req, res) => {
  try {
    let { id } = req.params
    let { title, description, code, price, status, stock, category, thumbnail } = req.body
    const productUpdated = {title, description, code, price, status, stock, category, thumbnail}
    let { error, msg, data } = await productService.updateProduct(id, productUpdated)
    if (error) {
      return res.status(500).json({
        error,
        msg,
        data
      })
    } else {
      res.status(200).json({
        error,
        msg,
        data
      })
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: "Error in server",
      data: {}
    })
  }
})
routerProducts.delete('/:id', async (req, res)=>{
  try {
    let { id } = req.params
  let {error, msg, data} = await productService.deleteProductById(id)
  if (error) {
    return res.status(401).json({
      error,
      msg,
      data
    })
  } else {
    res.status(200).json({
      error,
      msg,
      data
    })
  }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: true,
      msg: "Error in server",
      data: {}
    })
  } 
})