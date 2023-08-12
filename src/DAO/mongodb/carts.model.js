import { CartModel } from "./models/cart.model.js";

class CartsModel {
	async getAll() {
		try {
			const carts = await CartModel.find({});
			return carts;
		} catch (e) {
			console.log(e);
		}
	}

	async getById(cartId) {
		try {
			const cartById = await CartModel.findById(cartId).populate('products.product');
			return cartById;
		} catch (e) {
			console.log(e);
			throw e;
		}
	}

	// async readByRender(cartId) {
	// 	try {
	// 		const cart = await CartModel.findById(cartId).populate("products.product");
	// 		return cart;
	// 	} catch (e) {
	// 		console.log(e);
	// 	}
	// }

	// SE CREA EL CARRITO CUANDO SE REGISTRA EL USUARIO
	async create(newCart) {
		try {
			const cartCreated = await CartModel.create(newCart);
			return cartCreated;
		} catch (e) {
			console.log(e);
		}
	}

	async update(cartId, foundCart) {
		try {
			const cart = await CartModel.findByIdAndUpdate({_id: cartId}, foundCart);
			return cart;
		} catch (error) {
			throw new Error("Error updating cart in database");
		}
	}
}

export const cartsModel = new CartsModel();