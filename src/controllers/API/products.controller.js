import express from "express";
import { productService } from "../../services/products.service.js";

export const productsController = {
    getProducts: async (req, res) => {
        try {
          let { page, limit, category, sort, order } = req.query
          const queries = {page, limit, category, sort, order}
          let { error, msg, data, paginate } = await productService.getProducts(queries) 
          return res.json({
              status: error ? msg : 'success',
              payload: data || {},
              totalPages: paginate.totalPages,
              prevPage: paginate.prevPage,
              nextPage: paginate.nextPage,
              prevLink: paginate.prevLink,
              nextLink: paginate.nextLink
            })           
        } catch (error) {
            console.log(error)
            return res.status(500).json({
              error: true,
              msg: "Error in server",
              data: {}
          })
        }     
    },
    getProductById: async (req, res) => {
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
    },
    addProduct: async (req, res) => {
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
    },
    updateProduct: async (req, res) => {
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
    },
    deleteProduct: async (req, res)=>{
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
    }
}