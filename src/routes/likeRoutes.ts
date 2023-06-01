import { Router, Request, Response } from 'express';
import { verifyAuthToken, getUserIdFromToken } from '../middlewares/verifyUser';
import { createLike, deleteLike } from '../services/likeService';

const likeRouter = Router();

// Handle POST request for /api/likes
likeRouter.post('/', verifyAuthToken, async (req: Request, res: Response) => {
  const likeData = req.body;
  try {
    const userId = getUserIdFromToken(
      String(req.headers.authorization).split(' ')[1]
    );
    const like = await createLike({ ...likeData, userId: userId });
    if (like.Error) {
      res.status(400).json(like);
    } else {
      res.status(201).json(like.like);
    }
  } catch (error) {
    res.status(500).json({
      Error: 'Could not create a new like object'
    });
  }
});

// Handle DELETE request for /api/likes/:id
likeRouter.delete(
  '/:id',
  verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      const userId = getUserIdFromToken(
        String(req.headers.authorization).split(' ')[1]
      );
      const like = await deleteLike(req.params.id, userId);
      if (like === null) {
        res.status(404).json({
          Error: `Like with id ${req.params.id} not found`
        });
      } else if (like.Error) {
        res.status(401).json(like);
      } else {
        res.json({ message: `Like with id ${like.like?.id} has been deleted` });
      }
    } catch (error) {
      res.status(500).json({
        Error: `Error: Could not delete like with id ${req.params.id}`
      });
    }
  }
);

export default likeRouter;
