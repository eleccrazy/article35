import {
  createEvent,
  deleteEvent,
  deleteAllEvents,
  updateEvent,
  getEvents,
  getSingleEvent
} from './eventsService';
import { userSignUp, deleteAllUsers } from './userServices';

// Test suite for events service
describe('Test suite for event services', () => {
  // Delete all events before all tests
  beforeAll(async () => {
    await deleteAllEvents();
  });

  // Test if the getEvents function returns an empty array of events at start
  it('should return an empty array of events at start', async () => {
    const events = await getEvents();
    expect(events).toEqual([]);
  });

  // Test if the createEvent function returns an object with an Error property when necessary parameters are missed
  it('should return an object with an Error property when necessary parameters are missed', async () => {
    const result = await createEvent({
      title: '',
      description: '',
      userId: '',
      due_date: new Date(),
      location: '',
      image: '',
      web_link: ''
    });
    expect(result).toEqual({
      Error:
        'title, location, due_date, image, web_link, description and userId must be provided'
    });
  });

  // Test if the createEvent function returns an object with an Error property when a event with invalid title length is provided
  it('should return an object with an Error property when a event with invalid title length is provided', async () => {
    const result = await createEvent({
      title: 'te',
      description: 'test',
      userId: 'test-id',
      due_date: new Date(),
      location: 'test',
      image: 'test',
      web_link: 'test'
    });
    expect(result).toEqual({
      Error: 'title must be at least 3 characters long'
    });
  });

  // Test if the createEvent function returns an object with an Error property when a event with invalid description length is provided
  it('should return an object with an Error property when a event with invalid description length is provided', async () => {
    const result = await createEvent({
      title: 'test',
      description: 'test',
      userId: 'test-id',
      due_date: new Date(),
      location: 'test',
      image: 'test',
      web_link: 'test'
    });
    expect(result).toEqual({
      Error: 'description must be at least 100 characters long'
    });
  });

  // Test if the createEvent function returns an object with an Error property when a userId is not an existing user.
  it('should return an object with an Error property when a userId is not an existing user', async () => {
    const result = await createEvent({
      title: 'test',
      description:
        'Test if the createEvent function returns an object with an Error property when a userId is not an existing user.',
      userId: 'test-id',
      due_date: new Date(),
      location: 'test',
      image: 'test',
      web_link: 'test'
    });
    expect(result).toEqual({
      Error: 'userId must be an existing user'
    });
  });

  // Test if the createEvent function returns an object with an Error property when a due_date is not a valid date.
  it('should return an object with an Error property when a due_date is not a valid date', async () => {
    const result = await createEvent({
      title: 'test',
      description:
        'Test if the createEvent function returns an object with an Error property when a due_date is not a valid date.',
      userId: 'test-id',
      due_date: new Date('test'),
      location: 'test',
      image: 'test',
      web_link: 'test'
    });
    expect(result).toEqual({
      Error: 'due_date must be a valid date'
    });
  });

  // Test if the createEvent function returns an object with an Error property when a userId is not an existing user.
  it('should return an object with an Error property when a userId is not an existing user', async () => {
    const result = await createEvent({
      title: 'test',
      description:
        'Test if the createEvent function returns an object with an Error property when a userId is not an existing user.',
      userId: 'test-id',
      due_date: new Date(),
      location: 'test',
      image: 'test',
      web_link: 'test'
    });
    expect(result).toEqual({
      Error: 'userId must be an existing user'
    });
  });

  // Test if the createEvent function returns an event object when a valid event is provided
  it('should return an event object when a valid event is provided', async () => {
    // First create a user
    const userData = {
      email: 'test@gmail.com',
      password: '12345678',
      firstName: 'Test'
    };
    const result = await userSignUp(userData);
    const user = result.user;
    // Then create a event
    const event = {
      title: 'test',
      description:
        'Test if the createEvent function returns an event object whwhen a valid event is provideden a valid event is provided.',
      userId: user?.id as string,
      due_date: new Date(),
      location: 'test',
      image: 'test',
      web_link: 'test'
    };
    const eventResult = await createEvent(event);
    expect(eventResult.event?.id).toBeDefined();
    expect(eventResult.event?.userId).toEqual(user?.id);
  });

  // Test if the getEvents function returns an array of events
  it('should return an array of events', async () => {
    const events = await getEvents();
    expect(events.length).toBeGreaterThan(0);
  });

  // Test if the getSingleEvent function returns an object with an Error property when an invalid id is provided
  it('should return an object with an Error property when an invalid id is provided', async () => {
    const result = await getSingleEvent('test');
    expect(result).toBeNull();
  });

  // Test if the getSingleEvent function returns an event object when a valid id is provided
  it('should return an event object when a valid id is provided', async () => {
    // First get all events
    const events = await getEvents();
    // Then get a single event
    const event = await getSingleEvent(events[0].id);
    expect(event?.id).toEqual(events[0].id);
  });

  // Test if the updateEvent function returns an object with an Error property when an invalid id is provided
  it('should return an object with an Error property when an invalid id is provided', async () => {
    const result = await updateEvent('test', {
      title: 'test'
    });
    expect(result).toBeNull();
  });

  // Test if the updateEvent function returns an object with an Error property when an invalid length of title is provided.
  it('should return an object with an Error property when an invalid length of title is provided', async () => {
    // First get all events
    const events = await getEvents();
    // Then update a single event
    const result = await updateEvent(events[0].id, {
      title: 'te'
    });
    expect(result).toEqual({
      Error: 'title must be at least 3 characters long'
    });
  });

  // Test if the updateEvent function returns an object with an Error property when an invalid length of description is provided.
  it('should return an object with an Error property when an invalid length of description is provided', async () => {
    // First get all events
    const events = await getEvents();
    // Then update a single event
    const result = await updateEvent(events[0].id, {
      description: 'te'
    });
    expect(result).toEqual({
      Error: 'description must be at least 100 characters long'
    });
  });

  // Test if the deleteEvent function returns an object with an Error property when an invalid id is provided
  it('should return an object with an Error property when an invalid id is provided', async () => {
    const result = await deleteEvent('test');
    expect(result).toBeNull();
  });

  // Test if the deleteEvent function returns an event object when a valid id is provided
  it('should return a deleted event object when a valid id is provided', async () => {
    // First get all events
    const events = await getEvents();
    // Then delete a single event
    const result = await deleteEvent(events[0].id);
    expect(result?.id).toEqual(events[0].id);
  });

  // Delete all events after all tests
  afterAll(async () => {
    await deleteAllEvents();
    await deleteAllUsers();
  });
});
