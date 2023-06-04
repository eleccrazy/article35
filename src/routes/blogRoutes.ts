import { Router, Response, Request } from 'express';
import {
  getBlogs,
  getApprovedBlogs,
  getBlogComments,
  getBlogTags,
  getSingleBlog,
  getUnapprovedBlogs,
  updateBlog,
  deleteBlog,
  createBlog,
  approveBlog,
  unApproveBlog,
  linkTagsToBlog,
  appendLinkToBlog,
  countLikes
} from '../services/blogServices';
import { verifyAuthToken, verifyAdminToken } from '../middlewares/verifyUser';

const blogRouter = Router();

// Handle GET request for /blogs route
blogRouter.get(
  '/',
  verifyAuthToken,
  verifyAdminToken,
  async (req: Request, res: Response) => {
    try {
      const blogs = await getBlogs();
      res.json(blogs);
    } catch (error) {
      res.status(500).send(`Could not get blogs. Error: ${error}`);
    }
  }
);

// Handle GET request for /blogs/:id route
blogRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const blog = await getSingleBlog(req.params.id);
    if (blog === null) {
      res
        .status(404)
        .json({ message: `Blog with id ${req.params.id} not found` });
    } else {
      res.json(blog);
    }
  } catch (error) {
    res
      .status(500)
      .send(`Could not get blog with id ${req.params.id}. Error: ${error}`);
  }
});

// Handle POST request for /blogs route
blogRouter.post('/', verifyAuthToken, async (req: Request, res: Response) => {
  try {
    const blog = await createBlog(req.body);
    if (blog.Error) {
      res.status(400).json(blog);
    } else {
      res.status(201).json(blog.blog);
    }
  } catch (error) {
    res.status(500).send(`Could not create blog. Error: ${error}`);
  }
});

// Handle DELETE request for /blogs/:id route
blogRouter.delete(
  '/:id',
  verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      const result = await deleteBlog(req.params.id);
      if (result === null) {
        res
          .status(404)
          .json({ message: `Blog with id ${req.params.id} not found` });
      } else {
        res.json({ message: `Blog with id ${req.params.id} deleted.` });
      }
    } catch (error) {
      res
        .status(500)
        .send(
          `Could not delete blog with id ${req.params.id}. Error: ${error}`
        );
    }
  }
);

// Handle PUT request for /blogs/:id route
blogRouter.put('/:id', verifyAuthToken, async (req: Request, res: Response) => {
  try {
    const blog = await updateBlog(req.params.id, req.body);
    // Check if blog exists and if it does, check if the input data is valid
    if (blog === null) {
      res
        .status(404)
        .json({ message: `Blog with id ${req.params.id} not found` });
    } else if (blog.Error) {
      res.status(400).json(blog);
    } else {
      res.json(blog.blog);
    }
  } catch (error) {
    res
      .status(500)
      .send(`Could not update blog with id ${req.params.id}. Error: ${error}`);
  }
});

// Handle Get request for /blogs/:id/comments route
blogRouter.get('/:id/comments', async (req: Request, res: Response) => {
  try {
    const comments = await getBlogComments(req.params.id);
    res.json(comments);
  } catch (error) {
    res
      .status(500)
      .send(
        `Could not get comments for blog with id ${req.params.id}. Error: ${error}`
      );
  }
});

// Handle PUT request for /blogs/:id/link-update
blogRouter.put(
  '/:id/link-update',
  verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      const result = await appendLinkToBlog(req.params.id, req.body.link);
      if (result === null) {
        res
          .status(404)
          .json({ message: `Blog with id ${req.params.id} not found` });
      } else if (result.Error) {
        res.status(400).json(result);
      } else {
        res.json(result.blog);
      }
    } catch (error) {
      res
        .status(500)
        .send(
          `Could not add a new link to a blog with id ${req.params.id}. Error: ${error}`
        );
    }
  }
);

// Handle GET request for /blogs/:id/tags route
blogRouter.get('/:id/tags', async (req: Request, res: Response) => {
  try {
    const tags = await getBlogTags(req.params.id);
    res.json(tags);
  } catch (error) {
    res
      .status(500)
      .send(
        `Could not get tags for blog with id ${req.params.id}. Error: ${error}`
      );
  }
});

// Handle GET request for /blogs/get-all/approved route
blogRouter.get('/get-all/approved', async (req: Request, res: Response) => {
  try {
    const blogs = await getApprovedBlogs();
    res.json(blogs);
  } catch (error) {
    res.status(500).send(`Could not get approved blogs. Error: ${error}`);
  }
});

// Handle GET request for /blogs/get-all/unapproved route
blogRouter.get(
  '/get-all/unapproved',
  verifyAuthToken,
  verifyAdminToken,
  async (req: Request, res: Response) => {
    try {
      const blogs = await getUnapprovedBlogs();
      res.json(blogs);
    } catch (error) {
      res.status(500).send(`Could not get unapproved blogs. Error: ${error}`);
    }
  }
);

// Handle PUT request for /blogs/:id/approve route
blogRouter.put(
  '/:id/approve',
  verifyAuthToken,
  verifyAdminToken,
  async (req, res) => {
    try {
      const result = await approveBlog(req.params.id);
      if (result === null) {
        res
          .status(404)
          .json({ message: `Blog with id ${req.params.id} not found` });
      } else {
        res.json(result.blog);
      }
    } catch (error) {
      res
        .status(500)
        .send(
          `Could not approve blog with id ${req.params.id}. Error: ${error}`
        );
    }
  }
);

// Handle PUT request for /blogs/:id/unapprove route
blogRouter.put(
  '/:id/unapprove',
  verifyAuthToken,
  verifyAdminToken,
  async (req, res) => {
    try {
      const result = await unApproveBlog(req.params.id);
      if (result === null) {
        res
          .status(404)
          .json({ message: `Blog with id ${req.params.id} not found` });
      } else {
        res.json(result.blog);
      }
    } catch (error) {
      res
        .status(500)
        .send(
          `Could not approve blog with id ${req.params.id}. Error: ${error}`
        );
    }
  }
);

// Handle PUT request for /blogs/:id/link-tags route
blogRouter.put(
  '/:id/link-tags',
  verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      const result = await linkTagsToBlog(req.params.id, req.body.tags);
      if (result === null) {
        res
          .status(404)
          .json({ message: `Blog with id ${req.params.id} not found` });
      } else if (result.Error) {
        res.status(400).json(result);
      } else {
        res.json(result.blog);
      }
    } catch (error) {
      res
        .status(500)
        .send(
          `Could not link tags to blog with id ${req.params.id}. Error: ${error}`
        );
    }
  }
);

// Handle GET request for /blogs/:id/likes route
blogRouter.get('/:id/likes', async (req: Request, res: Response) => {
  try {
    const likes = await countLikes(req.params.id);
    if (likes === null) {
      res
        .status(404)
        .json({ message: `Blog with id ${req.params.id} not found` });
    }
    res.json(likes);
  } catch (error) {
    res
      .status(500)
      .send(
        `Could not get likes for blog with id ${req.params.id}. Error: ${error}`
      );
  }
});

export default blogRouter;
