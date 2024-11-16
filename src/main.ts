import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import compression from "compression"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import morgan from "morgan"
import path from "path";
import http from "node:http"
import { Server as SocketIOServer } from "socket.io"

import apiRouter from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { rateLimiter } from "./middlewares/rate-limiter.middleware";
import { FRONTEND_ORIGIN, LEADERBOARD, PORT } from "./constant";
import { mockSuccessResponse } from "./utils/mock";
import { StatusCodes } from "http-status-codes";
import UserService from "./services/user.service";

dotenv.config()

const app = express()
const server = http.createServer(app)

const io = new SocketIOServer(server, {
    cors: {
        origin: [FRONTEND_ORIGIN],
    }
})

export { io }

app.use(cors({
    origin: FRONTEND_ORIGIN,
    credentials: true
}))

app.use(morgan(":method :url :status :res[content-length] - :response-time ms"))

app.use(rateLimiter)

app.use(compression())

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(helmet());

//serve static file for image
app.use("/api/v1/uploads", express.static(path.join(__dirname, "..", "_uploads")));

// cookie middleware
app.use(cookieParser())

// api router 
app.use(apiRouter)

// ping API
app.get("/api/v1/ping", (req, res) => {
    return mockSuccessResponse(res, {
        data: new Date(),
        message: "PING",
        status: StatusCodes.OK
    })
})

// error response middleware
app.use(errorMiddleware)

io.on("connection", async (socket) => {
    console.log("Socket connection ", socket.id)

    // first emit top 10 leaderboard
    socket.emit(LEADERBOARD, await UserService.leaderboard())
})

server.listen(PORT, () => {
    // winstonLogger.info
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});