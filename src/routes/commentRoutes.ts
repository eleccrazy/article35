import exp from 'constants';
import { Router, Response, Request } from 'express';

const commentRouter = Router();

commentRouter.get('/', (req: Request, res: Response) => {
  res.send('Hello from comment routes!');
});

export default commentRouter;
