import express from 'express';   
const imageRouter = express.Router();

imageRouter.get('/', (req, res) => { 
    res.send('Hello from images')
});

export default imageRouter;
