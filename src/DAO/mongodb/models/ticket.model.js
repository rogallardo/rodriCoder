import { Schema, model } from "mongoose";

export const TicketModel = model('tickets', new Schema({
    code: {
        type: String,
        required: true,
        max: 100
    },
    purchase_datetime: {
        type: String,
        required: true,
        max: 100
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true,
        max: 100,
    }
}))