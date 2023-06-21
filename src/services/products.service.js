import { ProductModel } from "../DAO/models/product.model.js";
class ProductService {
    async getProducts(queries) {
        const result = {
            error: false,
            msg: "",
            data: {},
            paginate: {}
        }
        try {
            let { page, limit, category } = queries
            let products = await ProductModel.paginate({}, {limit: 5, page: page || 1})

            const docsNormalized = products.docs.map(doc=> {
                return {
                        id: doc._id.toString(),
                        title: doc.title,
                        description: doc.description,
                        code: doc.code,
                        price: doc.price,
                        status: doc.status,
                        stock: doc.stock,
                        category: doc.category,
                        thumbnail: doc.thumbnail
                    }
            })
            if ( limit ) {
                if (limit > 0 && limit <= docsNormalized.length) {
                    docsNormalized.length = limit
                }
            }
            result.data = docsNormalized
            result.msg = "Products sended successfully"
            result.paginate = {
                totalDocs: products.totalDocs, 
                totalPages: products.totalPages, 
                pagingCounter: products.pagingCounter, 
                hasPrevPage: products.hasPrevPage, 
                hasNextPage: products.hasNextPage, 
                prevPage: products.prevPage, 
                nextPage: products.nextPage
            }
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