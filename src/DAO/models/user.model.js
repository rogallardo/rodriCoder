import { Schema, model } from "mongoose";

export const UserModel = model('users', new Schema({
    firstName: {
        type: String,
        required: true,
        max: 100
    },
    lastName: {
        type: String,
        required: true,
        max: 100
    },
    email: {
        type: String,
        required: true,
        max: 100,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        max: 100,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    cart: {
        type: String,
        unique: true,
        default: null
    }

}))