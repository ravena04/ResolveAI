import { Server } from "socket.io";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(
      `User Connected: ${socket.id}`
    );

    // User room (notifications)
    socket.on("join", (userId) => {
      socket.join(userId);

      console.log(
        `User ${userId} joined room`
      );
    });

    // Ticket room (chat)
    socket.on(
      "join_ticket",
      (ticketId) => {
        socket.join(ticketId);

        console.log(
          `Socket ${socket.id} joined ticket ${ticketId}`
        );
      }
    );

    // Send chat message
    socket.on(
      "send_message",
      (data) => {
        io.to(data.ticketId).emit(
          "receive_message",
          data
        );

        console.log(
          `Message sent to ticket ${data.ticketId}`
        );
      }
    );

    // Typing indicator
    socket.on(
      "typing",
      (ticketId) => {
        socket
          .to(ticketId)
          .emit("user_typing");
      }
    );

    socket.on(
      "stop_typing",
      (ticketId) => {
        socket
          .to(ticketId)
          .emit("user_stop_typing");
      }
    );

    socket.on("disconnect", () => {
      console.log(
        `User Disconnected: ${socket.id}`
      );
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.io not initialized"
    );
  }

  return io;
};