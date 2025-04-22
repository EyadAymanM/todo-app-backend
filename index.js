import express from 'express';
import AuthRouter from './authentication/user.route.js'
import TodoRouter from './todo/todo.route.js'
import cors from 'cors'
const app = express();

app.listen(3000, () => console.log('Server is Listening on port: 3000'));

app.use(express.json());

app.use(cors());

app.use('/auth',AuthRouter);

app.use('/todo',TodoRouter);