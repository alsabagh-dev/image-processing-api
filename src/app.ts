import express from 'express';
import imageRouter from './routes/ImageRouter/image.router';

const app = express();
const port = 3000;

// use image router
app.use('/api/images', imageRouter);

app.use('/api/thumb', express.static('assets/thumbnails'));

app.get('/*', (req: express.Request, res: express.Response): void => {
    res.send(`
  Welcome to Image Processing API<br>
  You can use /api/image to resize an image<br>
  or /api/thumb/[imageName] to use it as placeholder
  EX<br>
  <a href="http://localhost:${port}/api/images?filename=fjord&width=500&height=200"> Exampe</a>
  `);
});

app.listen(port, () => {
    console.log(`server started at localhost:${port}`);
});

export default app;
