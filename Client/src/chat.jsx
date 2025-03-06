import { useEffect } from "react";
import { io } from "socket.io-client";



export default function Chat() {
    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL);
        socket.on("connect", () => {
          console.log(socket.id); // x8WIv7-mJelg7on_ALbx
        });
        socket.on("disconnect", () => {
          console.log(socket.id); // undefined
        });
    }, []);
    
  return (
    <div>
      <h1>Chat</h1>
    </div>
  );
}