import { io } from "socket.io-client";

const socket = io("http://localhost:8901", {
  withCredentials: true,
  autoConnect: false,
});

export default socket;