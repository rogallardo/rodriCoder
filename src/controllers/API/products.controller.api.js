import CustomError from "../../services/errors/customError.js";
import Errors from "../../services/errors/enums.js";
import { productService } from "../../services/products.service.js";
import "express-async-errors"

export const productsController = {
    getProducts:  async (req, res) => {
        try {
            let { page, limit, category, sort, order } = req.query
            const queries = {page, limit, category, sort, order}
            let { error, msg, data, paginate } = await productService.getProducts(queries)
            if(errosr) {
                return res.status(401).json({status: msg, payload: data})
            }
            res.json({status: msg, payload: data, totalPages: paginate.totalPages, prevPage: paginate.prevPage, nextPage: paginate.nextPage, prevLink: paginate.prevLink, nextLink: paginate.nextLink})           
        } catch (error) {    
             CustomError.createError({
                name: 'Error trying to get products',
                message: 'Cannot get the products, something is wrong',
                cause: 'Probably some products contains diferent format file',
                code: Errors.UNHANDLER_ERROR
              })     
        }     
    },
    getProductById: async (req, res) => {
        try {
            let { pid } = req.params
            let { error, msg, data } = await productService.getProductById(pid)
            if (error) {
                return res.status(401).json({status: msg, payload: data})
            }
            res.json({status: msg, payload: data})
        } catch (error) {
            throw CustomError.createError({
                name: 'Error trying to get product by Id',
                message: 'Cannot get the products, something is wrong with product Id',
                cause: 'Product IDs',
                code: Errors.ID_ERROR
              })  
        }
    },
    createProduct: async (req, res) => {
        try {
            let { title, description, code, price, status, stock, category, thumbnail } = req.body
            const newProduct = {title, description, code, price, status, stock,category, thumbnail}
            let { error, msg, data } = await productService.createProduct(newProduct)
            if (error) {
                return res.status(401).json({status: msg, payload: data})
            } 
            res.json({status: msg, payload: data})
        } catch (error) {
            throw CustomError.createError({
                name: 'Error creating a product',
                message: 'Cannot create the product',
                cause: 'Probably something is wrong with client data, or trying to create in db',
                code: Errors.UNHANDLER_ERROR
              })   
        }
    },
    updateProduct: async (req, res) => {
        try {
            let { pid } = req.params
            let { title, description, code, price, status, stock, category, thumbnail } = req.body
            if (!title || !description || !code || !price || !status || !stock || !category || !thumbnail){    
                return res.status(401).json({status: "Error, please complete the fields", payload: {}})
            }
            const productToUpdate = {title, description, code, price, status, stock, category, thumbnail}
            let { error, msg, data } = await productService.updateProduct(pid, productToUpdate)
            if (error) {
                return res.status(401).json({status: msg, payload: data})
            } 
            res.json({status: msg, payload: data})
        } catch (error) {
            throw CustomError.createError({
                name: 'Error updating a product',
                message: 'Cannot update the product',
                cause: 'Probably something is wrong with client data, or trying to update in db',
                code: Errors.UNHANDLER_ERROR
              })   
        }
    },
    deleteProduct: async (req, res) => {
        try {
            let { pid } = req.params
            let {error, msg, data} = await productService.deleteProductById(pid)
            if (error) {
                return res.status(401).json({status: msg, payload: data})
            }
            res.json({status: msg, payload: data})
        } catch (error) {
            throw CustomError.createError({
                name: 'Error deleting a product',
                message: 'Cannot delete the product',
                cause: 'Product ID doesnt exist, or error to delete product in db',
                code: Errors.UNHANDLER_ERROR
              })   
        }
    }
}