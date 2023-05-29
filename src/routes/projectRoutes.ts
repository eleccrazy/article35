import { Router, Response, Request } from 'express';
import { verifyAuthToken, verifyAdminToken } from '../middlewares/verifyUser';
import {
  getProjects,
  getSingleProject,
  deleteProject,
  updateProject,
  createProject,
  updateProjectSignatures
} from '../services/projectsService';

const projectRouter = Router();

// Handle GET request for all projects
projectRouter.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await getProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).send(`Could not get projects. Error: ${error}`);
  }
});

// Handle GET request for a single project
projectRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const project = await getSingleProject(req.params.id);
    if (project === null) {
      res
        .status(404)
        .json({ message: `Project with id ${req.params.id} not found` });
    } else {
      res.json(project);
    }
  } catch (error) {
    res
      .status(500)
      .send(`Could not get project with id ${req.params.id}. Error: ${error}`);
  }
});

// Handle POST request to create a new project
projectRouter.post(
  '/',
  verifyAuthToken,
  verifyAdminToken,
  async (req: Request, res: Response) => {
    try {
      const project = await createProject({ ...req.body, signatures: [] });
      if (project.Error) {
        res.status(400).json(project);
      } else {
        res.json(project.project);
      }
    } catch (error) {
      res.status(500).send(`Could not create project. Error: ${error}`);
    }
  }
);

// Handle DELETE request for a project
projectRouter.delete(
  '/:id',
  verifyAuthToken,
  verifyAdminToken,
  async (req: Request, res: Response) => {
    try {
      const project = await deleteProject(req.params.id);
      if (project === null) {
        res
          .status(404)
          .json({ message: `Project with id ${req.params.id} not found` });
      } else {
        res.json(project);
      }
    } catch (error) {
      res
        .status(500)
        .send(
          `Could not delete project with id ${req.params.id}. Error: ${error}`
        );
    }
  }
);

// Handle PUT request for a project
projectRouter.put(
  '/:id',
  verifyAuthToken,
  verifyAdminToken,
  async (req: Request, res: Response) => {
    try {
      const project = await updateProject(req.params.id, req.body);
      if (project === null) {
        res
          .status(404)
          .json({ message: `Project with id ${req.params.id} not found` });
      } else if (project.Error) {
        res.status(400).json(project);
      } else {
        res.json(project.project);
      }
    } catch (error) {
      res
        .status(500)
        .send(
          `Could not update project with id ${req.params.id}. Error: ${error}`
        );
    }
  }
);

// Handle PUT request for a project's signatures
projectRouter.put(
  '/:id/signatures',
  verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      const project = await updateProjectSignatures(
        req.params.id,
        req.body.signature
      );
      if (project === null) {
        res
          .status(404)
          .json({ message: `Project with id ${req.params.id} not found` });
      } else if (project.Error) {
        res.status(400).json(project);
      } else {
        res.json(project.project);
      }
    } catch (error) {
      res
        .status(500)
        .send(
          `Could not update project with id ${req.params.id}. Error: ${error}`
        );
    }
  }
);

export default projectRouter;
