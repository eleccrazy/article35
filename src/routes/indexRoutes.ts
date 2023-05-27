import { Router, Request, Response } from 'express';
import userRouter from './userRoutes';
import blogRouter from './blogRoutes';
import eventRouter from './eventRoutes';
import likeRouter from './likeRoutes';
import commentRouter from './commentRoutes';
import projectRouter from './projectRoutes';

const indexRouter = Router();

indexRouter.use('/users', userRouter);
indexRouter.use('/blogs', blogRouter);
indexRouter.use('/events', eventRouter);
indexRouter.use('/likes', likeRouter);
indexRouter.use('/comments', commentRouter);
indexRouter.use('/projects', projectRouter);

indexRouter.get('/', (req: Request, res: Response) => {
  res.send('Hello from index routes!');
});

export default indexRouter;
