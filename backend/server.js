import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import {db} from './db.js';
import userRoutes from './routes/user.js'
import messageRoutes from './routes/messages.js'
import http from 'http'
import {Server} from 'socket.io'
dotenv.config();
const app=express();
app.use(cors());
app.use(express.json());
const port=process.env.port;

app.use('/api/users', userRoutes);

const server= http.createServer(app);

const io= new Server(server, {
    cors:{origin:'*'}
});

io.on("connection", (socket)=>{
    console.log("socket connected",socket.id);
    socket.on("joinRoom", (id)=>{
        socket.join(id);
    })
    socket.on("sendMessage", ({to, from, message})=>{
        io.to(to).emit("recieveMessage", {to, from, message});
    })
})

app.use('/api/messages', messageRoutes);

db();
server.listen(port, ()=>{   
    console.log("server runnig on port", port);
})