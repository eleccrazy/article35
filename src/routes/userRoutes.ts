import { Router, Response, Request } from 'express';
import { verifyAuthToken } from '../middlewares/verifyUser';
import {
  getUsers,
  getUsersById,
  userSignUp,
  userLogin,
  updateUser,
  deleteUser
} from '../services/userServices';
import { SignUpData, LoginData, UserUpdateData } from '../models/user';

// Define a router for users
const userRouter = Router();

// Handle GET request for /users
userRouter.get('/', verifyAuthToken, async (req: Request, res: Response) => {
  res.send(await getUsers());
});

// Handle GET request for /users/:id
userRouter.get('/:id', verifyAuthToken, async (req: Request, res: Response) => {
  const user = await getUsersById(req.params.id);
  if (user == null) {
    res.status(404).json({ Error: 'User not found' });
  } else {
    res.json(user);
  }
});

// Handle POST request for /users/sign-up
userRouter.post('/sign-up', async (req: Request, res: Response) => {
  const userData: SignUpData = req.body;
  const result = await userSignUp(userData);
  if (result.Error) {
    res.status(400).json(result);
  } else {
    res.status(201).json(result);
  }
});

// Handle POST request for /users/login
userRouter.post('/login', async (req: Request, res: Response) => {
  const userData: LoginData = req.body;
  const result = await userLogin(userData);
  if (result?.Error) {
    res.status(401).json(result);
  } else {
    res.json(result);
  }
});

// Handle DELETE request for /users/:id
userRouter.delete(
  '/:id',
  verifyAuthToken,
  async (req: Request, res: Response) => {
    const result = await deleteUser(req.params.id);
    res.json(result);
  }
);

// Handle PUT request for /users/:id
userRouter.put('/:id', verifyAuthToken, async (req: Request, res: Response) => {
  const userData: UserUpdateData = req.body;
  const result = await updateUser(req.params.id, userData);
  if (result === null) {
    res.status(404).json({ Error: 'User not found' });
  } else {
    res.status(200).json(result);
  }
});

export default userRouter;
