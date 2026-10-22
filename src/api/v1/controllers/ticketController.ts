import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from 'src/constants/httpConstants';
import * as ticketService from '../services/ticketService';
import type { Ticket, TicketUrgency} from "../models/ticketModel"
import { stat } from 'node:fs';

export const createTicket = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.body.title) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Missing required field: title"
            });
        } else if (!req.body.description) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Missing required field: description"
            });
        } else if (!req.body.priority) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Invalid priority. Must be one of: critical, high, medium, low"
            })
        } else {
            const { title, description, priority} = req.body;

            const ticketData = {title, description, priority};

            const newTicket: Ticket = await ticketService.createTicket(ticketData);
            res.status(HTTP_STATUS.CREATED).json({
                message: "Ticket created successfully",
                data: newTicket
            });
        }
    } catch (error) {
        next(error);
    }
};

export const getAllTickets = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const tickets: Ticket[] = await ticketService.getAllTickets();
        res.status(HTTP_STATUS.OK).json({
            message: "Tickets retrieved",
            count: tickets.length,
            data: tickets,
        });
    } catch (error) {
        next(error);
    }
};

export const getTicketById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Number(req.params.id);

        const ticket: Ticket[] = await ticketService.getTicketById(id);

        res.status(HTTP_STATUS.OK).json({
            message: "Ticket retrieved successfully",
            data: ticket,
        });
    } catch(error) {
        if (error instanceof Error && error.message === "Ticket not found") {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Ticket not found"
            });
        } else {
            next(error);
        }
    }
};

export const updateTicket = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const validPriorities = ['critical', 'high', 'medium', 'low'];
    const validStatuses = ['open', 'in-progress', 'resolved'];

    const id = Number(req.params.id);
    const { status, priority } = req.body;

    if (priority !== undefined && !validPriorities.includes(priority)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            error: 'Invalid priority. Must be one of: critical, high, medium, low',
        });
        return;
    }

    if (status !== undefined && !validStatuses.includes(status)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            error: 'Invalid status. Must be one of: open, in-progress, resolved',
        });
        return;
    }

    try {
        const updateData = { status, priority };
        const updatedTicket: Ticket = await ticketService.updateTicket(id, updateData);
        
        res.status(HTTP_STATUS.OK).json({
            message: "Ticket updated successfully",
            data: updatedTicket,
        });
    } catch (error:any) {
        if (error instanceof Error && error.message === "Ticket not found") {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Ticket not found"
            });
            return;
        }
    }
};

export const deleteTicket = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Number(req.params.id);
        await ticketService.deleteTicket(id);
        res.status(HTTP_STATUS.OK).json({
            message: "Item deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
