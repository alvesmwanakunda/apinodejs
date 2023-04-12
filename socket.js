const io = global.io;

function initSocket(val, attribut){

    io.on('connection', (socket)=>{
        console.log('Socket connected:', socket.id);
        socket.on('disconnect',()=>{
            console.log('Socket disconnected', socket.id);
        });
        socket.on(val, (message)=>{
            console.log("Message", message);
            socket.broadcast.emit(val, attribut);
        });

    })
}
module.exports={initSocket};