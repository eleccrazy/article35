import { Router, Response, Request } from 'express';
import { verifyAuthToken, verifyAdminToken } from '../middlewares/verifyUser';
import {
  getTags,
  getSingleTag,
  createTag,
  deleteTag
} from '../services/tagServices';

// Define a router for tags
const tagRouter = Router();

// Handle GET request for /tags
tagRouter.get('/', verifyAuthToken, async (req: Request, res: Response) => {
  res.send(await getTags());
});

// Handle GET request for /tags/:id
tagRouter.get('/:id', verifyAuthToken, async (req: Request, res: Response) => {
  const tag = await getSingleTag(req.params.id);
  if (tag == null) {
    res.status(404).json({ Error: 'Tag not found' });
  } else {
    res.json(tag);
  }
});

// Handle POST request for /tags
tagRouter.post(
  '/',
  verifyAuthToken,
  verifyAdminToken,
  async (req: Request, res: Response) => {
    const tagNmame = req.body.name;
    const result = await createTag(tagNmame);
    if (result.Error) {
      res.status(400).json(result);
    } else {
      res.status(201).json(result.tag);
    }
  }
);

// Handle delte request for /tags/:id
tagRouter.delete(
  '/:id',
  verifyAuthToken,
  verifyAdminToken,
  async (req: Request, res: Response) => {
    const result = await deleteTag(req.params.id);
    res.json(result);
  }
);

// Handle PUT request for /tags/:id
tagRouter.put(
  '/:id',
  verifyAuthToken,
  verifyAdminToken,
  async (req: Request, res: Response) => {
    const tagNmame = req.body.name;
    const result = await createTag(tagNmame);
    if (result.Error) {
      res.status(400).json(result);
    } else {
      res.status(201).json(result.tag);
    }
  }
);

// Export the router
export default tagRouter;
