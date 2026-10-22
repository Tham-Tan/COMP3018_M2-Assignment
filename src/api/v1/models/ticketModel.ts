export interface Ticket {
    id: number,
    title: string,
    description: string,
    priority: 'low' | 'medium' | 'high' | 'critical',
    status: 'open' | 'in-progress' | 'resolved',
    createdAt: Date
}

export interface CreateTicket {
    title: string,
    description: string,
    priority: 'low' | 'medium' | 'high' | 'critical'
}

export interface UrgencyTicket {
    id: number,
    title: string,
    description: string,
    priority: 'low' | 'medium' | 'high' | 'critical',
    status: 'open' | 'in-progress' | 'resolved',
    createdAt: Date,
    ticketAge: number,
    urgencyScore: number,
    urgencyLevel: string
}