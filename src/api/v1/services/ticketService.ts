import { sampleTickets } from "src/data/sampleData";
import { CreateTicket, Ticket, UrgencyTicket } from "../models/ticketModel";

const tickets: Ticket[] = [];

let nextId = 1;

export const createTicket = async (ticketData: CreateTicket): Promise<Ticket> => {
  const newTicket: Ticket = {
    id: nextId++,
    title: ticketData.title,
    description: ticketData.description,
    priority: ticketData.priority,
    status: "open",
    createdAt: new Date(),
  };

  tickets.push(newTicket);
  return structuredClone(newTicket);
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

export const getTicketUrgency = async (id: number) => {
  const ticket = tickets.find(ticket => ticket.id === id);
  if (!ticket) return null;

  if (ticket.status === "resolved") {
    return {
      message: "Ticket urgency calculated",
      id: ticket.id,
      title: ticket.title,
      priority: ticket.priority,
      status: ticket.status,
      createdAt: ticket.createdAt,
      ticketAge: Math.floor((Date.now() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
      urgencyScore: 0,
      urgencyLevel: "Minimal. Ticket resolved."
    };
  }

  let urgencyScore = 0;
  switch (ticket.priority) {
    case "low": baseScore = 10; break;
    case "medium": baseScore = 20; break;
    case "high": baseScore = 30; break;
    case "critical": baseScore = 50; break;
  }

  const ticketAge = Math.floor((Date.now() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  urgencyScore += (ticketAge * 5);

  let urgencyLevel = "";
  if (urgencyScore >= 80) {
    urgencyLevel = "Critical. Immediate attention required.";
  } else if (urgencyScore >= 55) {
    urgencyLevel = "High urgency. Prioritize resolution.";
  } else if (urgencyScore >= 30) {
    urgencyLevel = "Moderate. Schedule for attention.";
  } else {
    urgencyLevel = "Low urgency. Address when capacity allows.";
  }

  return {
    message: "Ticket urgency calculated.",
    id: ticket.id,
    title: ticket.title,
    priority: ticket.priority,
    status: ticket.status,
    createdAt: ticket.createdAt,
    ticketAge: ticketAge,
    urgencyScore: urgencyScore,
    urgencyLevel: urgencyLevel
  };
};
