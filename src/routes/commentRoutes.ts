import { Router, Response, Request } from 'express';
import {
  createComment,
  updateComment,
  deleteComment,
  getSingleComment
} from '../services/commentServices';
import { verifyAuthToken } from '../middlewares/verifyUser';

const commentRouter = Router();

// Handle GET request for a single comment
commentRouter.get(
  '/:id',
  verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      const comment = await getSingleComment(req.params.id);
      if (comment === null) {
        return res.status(404).json({
          message: `Comment with id ${req.params.id} not found`
        });
      } else {
        return res.json(comment);
      }
    } catch (error) {
      res.status(500).json({
        message: `Could not retrieve comment with id ${req.params.id}`
      });
    }
  }
);

// Handle POST request to create a new comment
commentRouter.post(
  '/',
  verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      const result = await createComment({
        content: req.body.content,
        userId: req.body.userId,
        blogId: req.body.blogId
      });
      if (result.Error) {
        return res.status(400).json(result);
      } else {
        return res.status(201).json(result.comment);
      }
    } catch (error) {
      res.status(500).json({
        message: `Could not create comment ${error}`
      });
    }
  }
);

// Handle PUT request to update a comment
commentRouter.put(
  '/:id',
  verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      const result = await updateComment(req.params.id, req.body.content);
      if (result.Error) {
        return res.status(400).json(result);
      } else {
        return res.status(200).json(result.comment);
      }
    } catch (error) {
      res.status(500).json({
        message: `Could not update comment ${error}`
      });
    }
  }
);

// Handle DELETE request for /comments/:id route
commentRouter.delete(
  '/:id',
  verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      const result = await deleteComment(req.params.id);
      if (result === null) {
        res
          .status(404)
          .json({ message: `Comment with id ${req.params.id} not found` });
      } else {
        res.json({ message: `Comment with id ${req.params.id} deleted.` });
      }
    } catch (error) {
      res
        .status(500)
        .send(
          `Could not delete comment with id ${req.params.id}. Error: ${error}`
        );
    }
  }
);

export default commentRouter;
