import { MessageModel } from "./models/message.model.js";

class MessagesModel {
    async getAll() {  
        const messages = await MessageModel.find({})
        return products;		
    }
    async getById(mid) {
        const messages = await MessageModel.findById(mid)
        return messages;		
    }
    async create(newChat){
        const createdChat = await MessageModel.create(newChat)
        return createdChat
    }
    async updateById(mid, chatToUpdate){
        const updatedChat = await MessageModel.updateById(mid, chatToUpdate)
        return updatedChat
    }
}

export const messagesModel = new MessagesModel()