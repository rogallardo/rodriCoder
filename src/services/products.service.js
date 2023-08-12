import { productsModel } from "../DAO/mongodb/products.model.js";
// import { productsModel } from "../DAO/memory/products.model.memory.js";

class ProductService {
    async getProducts(queries) {
        const result = {
            error: false,
            msg: "",
            data: {},
            paginate: {}
        }
        try {
            let { page, limit, category, sort, order } = queries
            const filterQuery = category ? {category} : {}
            const options = {
                page: page || 1,
                limit: limit || 4,
                sort: sort ? {[sort]: order === 'asc' ? 1 : -1 } : {}
            };

            let products = await productsModel.getAll(filterQuery, options)
            if(products.docs){
                const docsNormalized = products.docs.map(doc => {
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
            let prevLink = products.hasPrevPage ? `http://localhost:8080/api/products/?page=${products.prevPage}` : null
            let nextLink = products.hasNextPage ? `http://localhost:8080/api/products/?page=${products.nextPage}` : null
            
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
            }else{
                result.data = products
                result.msg = "Products sended successfully"
            }
            
            
            return result
        } catch (error) {
            result.error = true
            result.msg = "Error trying to get products"

            return result
        }
    }
    async getProductById(pid) {
        const result = {
            error: false,
            msg: "",
            data: {}
        }
        try {
            let product = await productsModel.getById(pid)
            if(product._id){ 
                const id = product._id.toString()
                product = {
                id, 
                title: product.title,
                description: product.description,
                code: product.code,
                price: product.price,
                status: product.status,
                stock: product.stock,
                category: product.category,
                thumbnail: product.thumbnail
                }    
            } 
            result.msg = "Product sended successfully"
            result.data = product
            return result
        } catch (error) {
            result.error = true
            result.msg = "Error trying to get product, please checkID"
            return result
        }
    }
    async createProduct(newProduct) {
        const result = {
            error: false,
            msg: "",
            data: {}
        }
        let { title, description, code, price, status, stock, category,thumbnail} = newProduct
        if (!title || !description || !code || !price || !status || !stock || !category || !thumbnail) {
            result.error = true
            result.msg = "Error, please complete the fields"
            return result
        } else {
            try {
                const createdProduct = await productsModel.create(newProduct)
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
    async updateProduct(pid, productToUpdate) {
        const result = {
            error: false,
            msg: "",
            data: {}
        }
        let {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail
        } = productToUpdate
        if (!title || !description || !code || !price || !status || !stock || !category || !thumbnail) {
            result.error = true
            result.msg = "Error, please complete the fields"
            return result
        } else {
            try {
                const updatedProduct = await productsModel.update(pid, productToUpdate)
                if(updatedProduct){
                    result.msg = "Product updated"
                    result.data = updatedProduct
                }else{
                    result.error = true,
                    result.msg = "Cannot update product, please check ID"
                    result.data = {}
                }

                return result
            } catch (error) {
                result.error = true,
                result.msg = "Error in server"
                result.data = {}
                return result
            }
        }
    }
    async deleteProductById(pid) {
        const result = {
            error: false,
            msg: "",
            data: {}
        }
        try {
            const deletedProduct = await productsModel.deleteById(pid)
            if (deletedProduct) {
                result.msg = "Product deleted"
                result.data = deletedProduct
            } else {
                result.error = true
                result.msg = "Product was deleted, or doesn't exist"
                result.data = {}
            }

            return result

        } catch (error) {
            result.error = true,
            result.msg = "Cannot delete product. Error: " + error
            return result
        }

    }
}

export const productService = new ProductService()