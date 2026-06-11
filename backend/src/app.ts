import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import testRoutes from "./routes/test.routes";
import ticketRoutes from "./routes/ticket.routes";
import knowledgeRoutes from "./routes/knowledge.routes";
import uploadRoutes from "./routes/upload.routes";
import notificationRoutes from "./routes/notification.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import messageRoutes from "./routes/message.routes";
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  res.send("ResolveAI API Running");
});
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/knowledge", knowledgeRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/messages", messageRoutes);
export default app;