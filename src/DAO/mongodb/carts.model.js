import { CartModel } from "./models/cart.model.js";

class CartsModel {
	async getAll() {
		try {
			const carts = await CartModel.find({});
			return carts;
		} catch (error) {
			throw Error ('Error reading db mongo: ' + error);
		}
	}

	async getById(cid) {
		try {
			const cart = await CartModel.findById(cid).populate('products.product');
			return cart;
		} catch (error) {
			throw Error ('Error reading db mongo: ' + error);
		}
	}

	async create(newCart) {
		try {
			const cartCreated = await CartModel.create(newCart);
			return cartCreated;
		} catch (error) {
			throw Error ('Error writing db mongo: ' + error);
		}
	}

	async update(cid, foundCart) {
		try {
			const cart = await CartModel.findByIdAndUpdate({_id: cid}, foundCart);
			return cart;
		} catch (error) {
			throw Error ('Error updating db mongo: ' + error);
		}
	}

	async updateQuantity(cid, pid, quantity) {
		try {
			const updatedCart = await CartModel.findOneAndUpdate(  { _id: cid, 'products.product': pid },
			{ $set: { 'products.$.quantity': quantity } },
			{ new: true })
			return updatedCart;
		} catch (error) {
			throw Error ('Error updating db mongo: ' + error);
		}
	}
}


export const cartsModel = new CartsModel();
