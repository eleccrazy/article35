import { Router, Request, Response } from 'express';

const eventRouter = Router();

eventRouter.get('/', (req: Request, res: Response) => {
  res.send('Hello from event routes!');
});

export default eventRouter;
