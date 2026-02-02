import { useEffect, useState } from "react";
import axios from 'axios'
import {io} from 'socket.io-client'
import {jwtDecode} from 'jwt-decode'
import { useRef } from "react";

export  function Landing() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setusers]=useState([]);
  const [msg, setMsg]=useState("");
  const [recievedMsg, setrecievedMsg]=useState([]);
  const socket= useRef();
  const id=jwtDecode(sessionStorage.getItem("userId")).userId;

  useEffect(()=>{
    socket.current=io(import.meta.env.VITE_base_url);
  }, []);

  useEffect(()=>{
    if(socket.current && id){
      socket.current.emit("joinRoom", id);
    }
  }, [id]);

  useEffect(()=>{
      const getUsers=async()=>{
        try{
          const token=sessionStorage.getItem("userId");
          const res=await axios.post(`${import.meta.env.VITE_base_url}/api/users/usersList`, {token});
          setusers(res.data.users);
        }
        catch(err){
          console.log(err);
        }
      }
      getUsers();
  }, [])

  useEffect(()=>{
    const handler= ({to, from, message})=>{
         setrecievedMsg(prev=>[...prev, {receiver:to, sender:from, message:message}]);
    }
    socket.current.on("recieveMessage",handler)

    return()=>{
      socket.current.off("recieveMessage",handler);
    }
  }, [])

  const sendMessage=async ()=>{
    socket.current.emit("sendMessage", {to:selectedUser._id, from:id, message:msg });
    setrecievedMsg(prev=>[...prev, {receiver:selectedUser._id, sender:id, message:msg}]);
    setMsg("");
    const data= await axios.post(`${import.meta.env.VITE_base_url}/api/messages/save`, {sender:id, receiver:selectedUser._id, message:msg});
  }

  useEffect(()=>{
    const getMessages= async()=>{
          if(selectedUser){
            const msgs=await axios.post(`${import.meta.env.VITE_base_url}/api/messages/getMessages`, {user1:id, user2:selectedUser._id});
            setrecievedMsg(msgs.data.message);
          }
    }
    getMessages();
    
  }, [selectedUser]);

  const filteredMessages=recievedMsg.filter(msg => 
  (msg.sender===id && msg.receiver===selectedUser._id) ||
  (msg.sender===selectedUser._id && msg.receiver===id)
  )
  return (
    <div style={styles.container}>
      
      
      <div style={styles.userPanel}>
         <h2 style={styles.logo}>ChatApp</h2>

        <div style={styles.userList}>
          {users.map((user, index) => (
            <div
              key={user._id}
              style={styles.userItem}
              onClick={() => setSelectedUser(user)}
            >
              👤 {user.name}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.chatPanel}>
        {!selectedUser ? (
          <h2>👋 Welcome to ChatApp</h2>
        ) : (
          <>
            <h2>Chat with {selectedUser.name}</h2>
            <div style={styles.messagesBox}>
              {filteredMessages.map((m, index)=>(
                <p key={index} style={{textAlign: m.sender===id ? "right" : "left"}}>{m.message}</p>
              ))}
            </div>

            <div style={styles.inputBox}>
              <input type="text" placeholder="Type a message..." value={msg} onChange={(e)=>setMsg(e.target.value)} style={styles.messageInput}/>
              <button style={styles.sendBtn} onClick={sendMessage}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "sans-serif"
  },
  sidebar: {
    width: "200px",
    background: "#1f2937",
    color: "white",
    padding: "20px"
  },
  logo: {
    marginBottom: "30px"
  },
  navList: {
    listStyle: "none",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  userPanel: {
    width: "250px",
    borderRight: "1px solid #ddd",
    padding: "15px",
    background: "#f9fafb"
  },
  search: {
    width: "100%",
    padding: "8px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  userList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  userItem: {
    padding: "10px",
    background: "white",
    borderRadius: "6px",
    cursor: "pointer",
    border: "1px solid #eee"
  },
  chatPanel: {
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  messagesBox: {
    flex: 1,
    margin: "15px 0",
    padding: "10px",
    background: "#f3f4f6",
    borderRadius: "8px"
  },
  inputBox: {
    display: "flex",
    gap: "10px"
  },
  messageInput: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  sendBtn: {
    padding: "10px 15px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "6px"
  }
};
