import { productService } from "../../services/products.service.js";

export const productsController = {
    getProducts: async (req, res) => {
        try {
            let { page, limit, category, sort, order } = req.query
            const queries = {page, limit, category, sort, order}
            let { error, msg, data, paginate } = await productService.getProducts(queries)
            if(error) {
                return res.status(401).json({status: msg, payload: data})
            }
            res.json({status: msg, payload: data, totalPages: paginate.totalPages, prevPage: paginate.prevPage, nextPage: paginate.nextPage, prevLink: paginate.prevLink, nextLink: paginate.nextLink})           
        } catch (error) {
            return res.status(500).json({status: 'Error in server: '+ error, payload: {}})
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
            return res.status(500).json({status: "Error in server: " + error, payload: {}})
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
          return res.status(500).json({status: "Error in server", payload: {}
          }) 
        }
    },
    updateProduct: async (req, res) => {
        try {
            let { pid } = req.params
            let { title, description, code, price, status, stock, category, thumbnail } = req.body
            const productUpdated = {title, description, code, price, status, stock, category, thumbnail}
            let { error, msg, data } = await productService.updateProduct(pid, productUpdated)
            if (error) {
                return res.status(401).json({status: msg, payload: data})
            } 
            res.json({status: msg, payload: data})
        } catch (error) {
            return res.status(500).json({status: "Error in server", payload: {}}) 
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
            return res.status(500).json({status: "Error in server: " + error, payload: {}})
        }
    }
}