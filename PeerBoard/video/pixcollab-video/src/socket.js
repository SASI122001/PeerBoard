import { io } from "socket.io-client";
const socket = io("http://localhost:3001"); // adjust to your backend
export default socket;
