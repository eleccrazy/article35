import { EventStore, UpdateEvent, CreateEvent } from '../models/event';
import { getUsersById } from './userServices';

// Create an instance of the EventStore class.
const eventStore = new EventStore();

// Get all events.
export const getEvents = async () => {
  try {
    const events = await eventStore.getEvents();
    return events;
  } catch (error) {
    throw new Error(`Could not get all events. Error: ${error}`);
  }
};

// Get a single event by its id.
export const getSingleEvent = async (id: string) => {
  try {
    const event = await eventStore.getSingleEvent(id);
    return event;
  } catch (error) {
    return null;
  }
};

// Create a new event.
export const createEvent = async (eventData: CreateEvent) => {
  try {
    // Check whether all required fields are provided.
    if (
      !eventData.title ||
      !eventData.description ||
      !eventData.due_date ||
      !eventData.userId ||
      !eventData.image ||
      !eventData.location ||
      !eventData.web_link
    ) {
      return {
        Error:
          'title, location, due_date, image, web_link, description and userId must be provided'
      };
    }
    // Check the length of the title.
    if (eventData.title.length < 3) {
      return { Error: 'title must be at least 3 characters long' };
    }
    // Check the length of the description.
    if (eventData.description.length < 100) {
      return { Error: 'description must be at least 100 characters long' };
    }
    // Check due_date if it is a valid date
    if (isNaN(Date.parse(String(eventData.due_date)))) {
      return { Error: 'due_date must be a valid date' };
    }
    // Check if user with userId exists
    const user = await getUsersById(eventData.userId);
    if (user === null) {
      return { Error: 'userId must be an existing user' };
    }
    // Create a new event
    const event = await eventStore.createEvent(eventData);
    return { event: event };
  } catch (error) {
    return { Error: `Could not create a new event. Error: ${error}` };
  }
};

// Delete an event
export const deleteEvent = async (id: string) => {
  try {
    const project = await eventStore.deleteEvent(id);
    return project;
  } catch (error) {
    return null;
  }
};

// Update an event
export const updateEvent = async (id: string, eventData: UpdateEvent) => {
  try {
    // Check if the event with the provided id exists
    const eventCheck = await eventStore.getSingleEvent(id);
    if (eventCheck === null) {
      return null;
    }
    // Check the length of the title.
    if (eventData.title && eventData.title.length < 3) {
      return { Error: 'title must be at least 3 characters long' };
    }
    // Check the length of the description.
    if (eventData.description && eventData.description.length < 100) {
      return { Error: 'description must be at least 100 characters long' };
    }
    // Update an event
    const event = await eventStore.updateEvent(id, eventData);
    return { event: event };
  } catch (error) {
    return { Error: `Could not update an event. Error: ${error}` };
  }
};

// Delete all events
export const deleteAllEvents = async () => {
  try {
    // Get all events first
    const events = await eventStore.getEvents();
    // Delete all events
    for (const event of events) {
      await eventStore.deleteEvent(event.id);
    }
  } catch (error) {
    return null;
  }
};
