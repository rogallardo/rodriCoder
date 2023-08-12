import { Schema, model} from "mongoose";
export const CartModel = model('carts', new Schema({
    products: {
        type: [
            {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products',
                
                }, quantity: Number,
            },
        ],
    default: []
    },
},
))