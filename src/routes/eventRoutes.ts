import { Router, Request, Response } from 'express';
import { verifyAuthToken, verifyAdminToken } from '../middlewares/verifyUser';
import {
  getEvents,
  getSingleEvent,
  deleteEvent,
  updateEvent,
  createEvent
} from '../services/eventsService';

const eventRouter = Router();

export default eventRouter;

// Handle GET request for all events
eventRouter.get('/', async (req: Request, res: Response) => {
  try {
    const events = await getEvents();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      Error: 'Something went wrong'
    });
  }
});

// Handle GET request for a single event
eventRouter.get('/:id', async (req: Request, res: Response) => {
  const event = await getSingleEvent(req.params.id);
  try {
    if (event === null) {
      res
        .status(404)
        .json({ message: `Event with id ${req.params.id} not found` });
    } else {
      res.status(200).json(event);
    }
  } catch (error) {
    res.status(500).json({
      Error: 'Something went wrong'
    });
  }
});

// Handle POST request for creating an event
eventRouter.post(
  '/',
  verifyAuthToken,
  verifyAdminToken,
  async (req: Request, res: Response) => {
    try {
      const event = await createEvent(req.body);
      if (event.Error) {
        res.status(400).json(event);
      } else {
        res.status(201).json(event.event);
      }
    } catch (error) {
      res.status(500).json({
        Error: 'Something went wrong'
      });
    }
  }
);

// Handle PUT request for updating an event
eventRouter.put(
  '/:id',
  verifyAuthToken,
  verifyAdminToken,
  async (req: Request, res: Response) => {
    try {
      const event = await updateEvent(req.params.id, req.body);
      if (event === null) {
        res
          .status(404)
          .json({ message: `Event with id ${req.params.id} not found` });
      } else if (event.Error) {
        res.status(400).json(event);
      } else {
        res.status(200).json(event.event);
      }
    } catch (error) {
      res.status(500).json({
        Error: 'Something went wrong'
      });
    }
  }
);

// Handle DELETE request for deleting an event
eventRouter.delete(
  '/:id',
  verifyAuthToken,
  verifyAdminToken,
  async (req: Request, res: Response) => {
    try {
      const event = await deleteEvent(req.params.id);
      if (event === null) {
        res
          .status(404)
          .json({ message: `Event with id ${req.params.id} not found` });
      } else {
        res.status(200).json(event);
      }
    } catch (error) {
      res.status(500).json({
        Error: 'Something went wrong'
      });
    }
  }
);
