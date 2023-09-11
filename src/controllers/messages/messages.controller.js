import { messagesService } from "../../services/messages.service.js";

export const messagesController = {
    messagesInit: async (req, res) => {
        const socketServer = req.app.get('socketServer');
        // Conectar el socket
        socketServer.on('connection', async (socket) => {
            console.log(`conectado con id ${socket.id}`);

            
            socket.on('chat', async (msg)=>{
                if(msg){
                    const response = await messagesService.getMessagesById('64f7bf3937cf12b961a1e871')
                    socket.emit('chat', response)
                }
               
            })
           
        });
        const pepe = 'pe'
        return res.render('messages', {pepe})
    },
}
