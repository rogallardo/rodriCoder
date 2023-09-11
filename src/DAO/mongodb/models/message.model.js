import { Schema, model } from "mongoose";

export const MessageModel = model('messages', new Schema({
    messages: { type: Array, required: true },

}))