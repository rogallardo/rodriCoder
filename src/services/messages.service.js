import { messagesModel } from "../DAO/mongodb/messages.model.js"


class MessageService {
     result = {
        error: false,
        msg: "",
        data: {}
    }
    getAllMessages(){

    }
   async getMessagesById(mid){
        try {
            const messages = await messagesModel.getById(mid)
            this.result.msg = "Messages sended"
            this.result.data = messages 
            return this.result
        } catch (error) {
            this.result.error = true
            this.result.msg = "Cannot get messages : "+ error,
            this.result.data = {}
            return this.result 
        }
    }
    async createMessages(){
        try {
            const newChat = {
                messages: []
            }
            const createdChat = await messagesModel.create(newChat)
            this.result.msg = "New chat created"
            this.result.data = createdChat
            return this.result
        } catch (error) {
            this.result.error = true
            this.result.msg = 'Cannot create chat'
            this.result.data = []
            return this.result
        }
    }
    async updateMessages(mid, messagesToUpdate){
        try {
            messagesToUpdate = [{message: 'hola', user: 'Rodrigo', date: '5/9/2023'}]
            const updatedChat = await messagesModel.updateById(mid, messagesToUpdate)
            this.result.msg = "Messages updated"
            this.result.data = updatedChat
            return this.result
        } catch (error) {
            this.result.error = true
            this.result.msg = "Cannot update chat"
            this.result.data = []
            return this.result
        }
    }

}
export const messagesService = new MessageService()