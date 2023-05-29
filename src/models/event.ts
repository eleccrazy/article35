import { Event } from '@prisma/client';
import client from '../database';

// Define the shape of the data that will be used to create a new event.
export type CreateEvent = {
  title: string;
  description: string;
  due_date: Date;
  location: string;
  image: string;
  web_link: string;
  userId: string;
};

// Define the shape of the data that will be used to update an event.
export type UpdateEvent = {
  title?: string;
  description?: string;
  due_date?: Date;
  location?: string;
  image?: string;
  web_link?: string;
};

// Define a class that represents a events table in the database
export class EventStore {
  // Get all events
  async getEvents(): Promise<Event[]> {
    try {
      const events = await client.event.findMany();
      return events;
    } catch (error) {
      throw new Error(`Could not get all events. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Get a single event by its id.
  async getSingleEvent(id: string): Promise<Event | null> {
    try {
      const event = await client.event.findUnique({
        where: { id: id }
      });
      return event;
    } catch (error) {
      throw new Error(`Could not get a event with id ${id}. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Create a new Event.
  async createEvent(eventData: CreateEvent): Promise<Event> {
    try {
      const event: Event = await client.event.create({
        data: eventData
      });
      return event;
    } catch (error) {
      throw new Error(`Could not create a new event. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Delete an event by its id.
  async deleteEvent(id: string): Promise<Event | null> {
    try {
      const event = await client.event.delete({
        where: { id: id }
      });
      return event;
    } catch (error) {
      throw new Error(
        `Could not delete a event with id ${id}. Error: ${error}`
      );
    } finally {
      await client.$disconnect();
    }
  }

  // Update an event by its event
  async updateEvent(id: string, eventData: UpdateEvent): Promise<Event | null> {
    try {
      const event = await client.event.update({
        where: { id: id },
        data: eventData
      });
      return event;
    } catch (error) {
      throw new Error(
        `Could not update a event with id ${id}. Error: ${error}`
      );
    } finally {
      await client.$disconnect();
    }
  }
}
