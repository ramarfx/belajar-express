import express, { response } from 'express'
import userController from '../controller/user-controller.js';

const publicRouter = express.Router();
publicRouter.post('/api/users', userController.register)

// publicRouter.get('/', (req, res) => {
//   return response.json({
//     message: 'Hello World'
//   })
// })

export {
    publicRouter
}