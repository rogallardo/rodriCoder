const socket = io()
const chatInput = document.getElementById('chatInput')

socket.on('chat', (msgBack)=>{
    console.log(msgBack)
})
chatInput.addEventListener('keypress', (e)=>{
    if(e.key == 'Enter'){
        const msg = chatInput.value
        socket.emit('chat', msg)
    }
})
//1134280005 45210101