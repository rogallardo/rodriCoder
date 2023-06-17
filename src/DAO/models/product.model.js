import {Schema, model} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'
export const ProductModel = model('products', new Schema({  
    title: String,
    description: String, 
    code: String, 
    price: Number, 
    status: String, 
    stock: Number, 
    category: String, 
    thumbnail: Array
}).plugin(mongoosePaginate))