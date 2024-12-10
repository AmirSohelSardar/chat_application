const io = require("socket.io")(3000, {
  cors: {
    origin: "*", // Allow all origins for simplicity
  },
});

// Log server status
console.log("Server running at http://localhost:3000");

const users = {}; // Store user data

io.on("connection", (socket) => {
  // When a new user joins
  socket.on("new-user-joined", (name) => {
    console.log(`New user joined: ${name}`);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name); // Notify others about the new user
  });

  // When a user sends a message
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${users[socket.id]}`);
    socket.broadcast.emit("left", users[socket.id]); // Notify others that the user left
    delete users[socket.id]; // Remove user from the list
  });
});
