import { ProductModel } from "../DAO/models/product.model.js";
class ProductService {
    async getProducts() {
        const result = {
            error: false,
            msg: "",
            data: {}
        }
        try {
            let res = await ProductModel.paginate({}, {limit: 5, page: 1})
            console.log(res)
            const products = await ProductModel.find({})
            result.data = products
            result.msg = "Products sended successfully"
            return result
        } catch (error) {
            result.error = true
            result.msg = "Error trying to get products"
            console.log(error)
            return result
        }
    }
    async getProductById(id) {
        const result = {
            error: false,
            msg: "",
            data: {}
        }
        try {
            const product = await ProductModel.findById(id)
            if(product != null){
                result.msg = "Product sended successfully"
                result.data = product
            }else{
                result.error = true
                result.msg = "Product was deleted, or doesn't exist"
                result.data = {}
            }
            
            return result
        } catch (error) {
            result.error = true
            result.msg = "Error trying to get product"
            console.log(error)
            return result
        }
    }
    async createProduct(newProduct) {
        const result = {
            error: false,
            msg: "",
            data: {}
        }
        let {title, description, code, price, status, stock, category,thumbnail} = newProduct
        if (!title || !description || !code || !price || !status || !stock || !category || !thumbnail) {
            result.error = true
            result.msg = "Error, please complete the fields"
            return result
        } else {
            try {
                const createdProduct = await ProductModel.create(newProduct)
                result.msg = "Product added"
                result.data = createdProduct
                return result
            } catch (error) {
                result.error = true,
                result.msg = "Cannot add a product, something wrong with db"
                result.data = {}
                return result
            }
        }
    }
    async updateProduct(id, productUpdated) {
        const result = {
            error: false,
            msg: "",
            data: {}
        }
        let {title, description, code, price, status, stock, category, thumbnail} = productUpdated
        if (!title || !description || !code || !price || !status || !stock || !category || !thumbnail) {
            result.error = true
            result.msg = "Error, please complete the fields"
            return result
        } else {
            try {
                const productToUpdate = await ProductModel.findByIdAndUpdate(id, productUpdated)
                result.msg = "Product updated"
                result.data = productUpdated
                return result
            } catch (error) {
                result.error = true,
                result.msg = "Cannot update product, something wrong with db"
                result.data = {}
                return result
            }
        }
    }
    async deleteProductById(id) {
        const result = {
            error: false,
            msg: "",
            data: {}
        }
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(id)
            if(deletedProduct != null){
                result.msg = "Product deleted"
                result.data = deletedProduct
            }else{
                result.error = true
                result.msg = "Product was deleted, or doesn't exist"
                result.data = {}
            }
            
            return result
           
        } catch (error) {
            console.log(error)
            result.error = true,
            result.msg = "Cannot delete product, please check ID"
            return result
        }
       
    }
}

export const productService = new ProductService()