import express from 'express';
import imageRouter from './routes/image.router';

const app = express();
const port = 3000;

// use image router
app.use('/api/images', imageRouter);

app.get('/api', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});


export default app;