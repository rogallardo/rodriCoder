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
            let { page, limit, category, sort, order, originalURL } = queries
            category = category ? {category} : {}
           
            const options = {
                page: page || 1,
                limit: limit || 5,            
              };
              if(sort){
                options.sort = { [sort]: order === 'asc' ? 1 : -1 }
            } 
            
            let products = await ProductModel.paginate(category, options)

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
            let prevLink = products.hasPrevPage ? `http://localhost:8080/products/?page=${products.prevPage}` : null
            let nextLink = products.hasNextPage ? `http://localhost:8080${originalURL}&page=${products.nextPage}` : null
        //si quiero mantener las queries y ademas quiero las paginas dinamicas, solo reemplazo la pagina en la url actual:
            if(page){
                prevLink = products.hasPrevPage ? originalURL.replace(`page=${page}`, `page=${products.prevPage}`) : null
                nextLink = products.hasNextPage ? originalURL.replace(`page=${page}`, `page=${products.nextPage}`) : null
            }

            result.data = docsNormalized
            result.msg = "Products sended successfully"
            result.paginate = {
                page,
                totalDocs: products.totalDocs, 
                totalPages: products.totalPages, 
                pagingCounter: products.pagingCounter, 
                hasPrevPage: products.hasPrevPage, 
                hasNextPage: products.hasNextPage, 
                prevPage: products.prevPage, 
                nextPage: products.nextPage,
                prevLink,
                nextLink
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