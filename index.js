const PORT=process.env.PORT||8900;
const io=require('socket.io')(PORT,{
    cors:{
        origin:'*'
    }
})

let users=[]
const addUsers=(userId,socketId)=>{
    
    !users.some((user)=>user.userId===userId)&&
    users.push({userId,socketId})
}
const removeUser=(socketId)=>{
    users=users.filter((user)=>user.socketId!==socketId)
    
}
const getUsers=(userId)=>{
    return users.find((user)=>user.userId==userId)
}
io.on("connection", (socket) => {
  // ...
  
  socket.on('addUsers',(userId)=>{
    
    addUsers(userId,socket.id)
    console.log(users.length)
    io.emit('online-users',users)
  })
  
  socket.on('sendMessage',({senderId,receiverId,message})=>{
             const user=getUsers(receiverId)
             
             if(user?.socketId){console.log('msg sended')

                io.to(user?.socketId).emit('getMessage',{senderId,message})
             }else{
                console.log(user)
             }

  })


  socket.on('disconnect',()=>{
    console.log('user is disconnected')
    
    removeUser(socket.id)
    io.emit('online-users',users)
})
});

