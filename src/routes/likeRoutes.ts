import { Router, Request, Response } from 'express';

const likeRouter = Router();

likeRouter.get('/', (req: Request, res: Response) => {
  res.send('Hello from like routes!');
});

export default likeRouter;
