import {ProductModel} from "../DAO/models/product.model.js";

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

            let products = await ProductModel.paginate(filterQuery, options)
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
            let product = await ProductModel.findById(id)
            if (product != null) {
                const id = product._id.toString()
                product = {id, 
                    title: product.title,
                    description: product.description,
                    code: product.code,
                    price: product.price,
                    status: product.status,
                    stock: product.stock,
                    category: product.category,
                    thumbnail: product.thumbnail
                }
                result.msg = "Product sended successfully"
                result.data = product
            } else {
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
        let { title, description, code, price, status, stock, category,thumbnail} = newProduct
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
        let {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail
        } = productUpdated
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
            if (deletedProduct != null) {
                result.msg = "Product deleted"
                result.data = deletedProduct
            } else {
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