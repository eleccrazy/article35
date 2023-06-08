import express, { Request, Response } from 'express';
import indexRouter from './routes/indexRoutes';
import cors from 'cors';

const app = express();
const port = 3000;

// Allow all CORS requests.
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', indexRouter);

app.get('/', (req: Request, res: Response) => {
  // Redirect all requests from the / endpoint to /api endpoint.
  res.redirect('/api');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

export default app;
