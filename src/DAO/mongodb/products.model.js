import { ProductModel } from "./models/product.model.js";

export class ProductsModel{
    async getAll(filterQuery, options) {  
			const products = await ProductModel.paginate(filterQuery, options);
			return products;		
	}
	async getById(pid) {
			const product = await ProductModel.findById(pid);
			return product;		
	}
	// async getManyById(productsIdsArray){
	// 	try {
	// 		const documents = await ProductModel.find({ _id: { $in: productsIdsArray } })
	// 	return documents
	// 	} catch (error) {
	// 		throw Error('Error en modelo en getmanybyid')
	// 	}
		
	// }

	async create(newProduct) {
			const createdProduct = await ProductModel.create(newProduct);
			return createdProduct;
	}

	async update(pid, productToUpdate) {
			const updatedProduct = await ProductModel.findByIdAndUpdate(pid, productToUpdate);
			return updatedProduct;
	}


    async deleteById(pid) {
			const deletedProduct = await ProductModel.findByIdAndDelete(pid);
			return deletedProduct;
	}
}

export const productsModel = new ProductsModel();
