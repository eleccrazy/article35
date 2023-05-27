import { Router, Response, Request } from 'express';

const blogRouter = Router();

blogRouter.get('/', (req: Request, res: Response) => {
  res.send('Hello from blog routes!');
});

export default blogRouter;
