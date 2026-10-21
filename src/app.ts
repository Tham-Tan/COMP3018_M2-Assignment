// Imports
import express, { Express } from "express";
import morgan from "morgan"
import ticketServiceRoutes from "./api/v1/routes/ticketServicesRoutes"

// initialize the express application
const app: Express = express();

interface Ticket {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in-progress' | 'resolved';
    createdAt: Date;
}

app.use(morgan("combined"));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use(express.json());

app.use("/api/v1/tickets", ticketServiceRoutes)

