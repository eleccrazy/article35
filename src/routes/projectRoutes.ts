import { Router, Response, Request } from 'express';

const projectRouter = Router();

projectRouter.get('/', (req: Request, res: Response) => {
  res.send('Hello from project routes!');
});

export default projectRouter;
