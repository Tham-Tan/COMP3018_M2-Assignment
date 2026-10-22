import { sampleTickets } from "src/data/sampleData";
import { CreateTicket, Ticket } from "../models/ticketModel";

const tickets: Ticket[] = [];

export const createTicket = async (ticketData: CreateTicket): Promise<Ticket> => {
  const newTicket: Ticket = {
    id: tickets.length + 1,
    title: ticketData.title,
    description: ticketData.description,
    priority: ticketData.priority,
    status: "open",
    createdAt: new Date()
  }

  tickets.push(newTicket);
  return newTicket;
};

export const getAllTickets = async (): Promise<Ticket[]> => {
  return structuredClone(tickets);
};

export const getTicketById = async (id: number): Promise<Ticket> => {
  const ticket = tickets.find((ticket: Ticket) => ticket.id === id);

  if (!ticket) {
    throw new Error(`Ticket with ID ${id} not found`);
  }

  return structuredClone(ticket);
};

export const updateTicket = async (
  id: number,
  ticketData: Pick<Ticket, "status" | "priority">
): Promise<Ticket> => {
  const index: number = tickets.findIndex((ticket: Ticket) => ticket.id === id);

  if (index === -1) {
    throw new Error(`Ticket with ID ${id} not found`);
  }

  tickets[index] = {
    ...tickets[index],
    ...ticketData,
  };

  return structuredClone(tickets[index]);
};

export const deleteTicket = async (id: number): Promise<void> => {
  const index: number = tickets.findIndex((ticket: Ticket) => ticket.id === id);

  if (index === -1) {
    throw new Error(`Ticket with ID ${id} not found`);
  }

  tickets.splice(index, 1);
};
