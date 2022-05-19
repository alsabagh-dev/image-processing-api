import express from 'express';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

const imageRouter = express.Router();

const getThumbnailName = (
  filename: string,
  width: number,
  height: number
): string => {
  return `${filename}_${width}_${height}.jpg`;
};

const error = (code: number, msg: string, res: express.Response) => {
  res.statusMessage = msg;
  res.status(code).json(msg);
};

const validateReq = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  const filename = req.query.filename as unknown as string;
  const width = parseInt(req.query.width as unknown as string);
  const height = parseInt(req.query.height as unknown as string);

  if (filename === undefined || filename.length === 0) {
    const msg = 'Must provid filename';
    error(400, msg, res);
  } else if (isNaN(width) || isNaN(height)) {
    const msg = 'width and height must be numbers';
    error(400, msg, res);
  } else if (width < 50 || height < 50) {
    const msg = 'width and height must be greater than 50';
    error(400, msg, res);
  } else {
    next();
  }
};
const sendFileFromThum = async (thumbnail: string, res: express.Response) => {
  res.send(`<img src="http://localhost:3000/api/thumb/${thumbnail}" />`);
};
const getImageFromThumbnail = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const filename = req.query.filename as unknown as string;
  const width = parseInt(req.query.width as unknown as string);
  const height = parseInt(req.query.height as unknown as string);
  const thumbnail = getThumbnailName(filename, width, height);
  try {
    await readFile(path.join(__dirname, '../../assets/thumbnails/', thumbnail))
    await sendFileFromThum(thumbnail, res);
  } catch (error) {
    next();
  }
};

const validateImageInFull = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const filename = (req.query.filename as unknown as string) + '.jpg';

  const files = await readdir(path.join(__dirname, '../../assets/full/'));

  if (files.includes(filename)) {
    next();
  } else {
    const msg = `File not found, supported filse: ${files.map(
      (file) => path.parse(file).name
    )} `;
    error(404, msg, res);
  }
};

imageRouter.get(
  '/',
  validateReq,
  validateImageInFull,
  getImageFromThumbnail,
  async (req, res): Promise<void> => {
    const filename = req.query.filename as unknown as string;
    const width = parseInt(req.query.width as unknown as string);
    const height = parseInt(req.query.height as unknown as string);

    const thumbnail = getThumbnailName(filename, width, height);

    const image = await readFile(
      path.join(__dirname, '../../assets/full/', filename + '.jpg')
    );
    const output = path.join(__dirname, '../../assets/thumbnails/', thumbnail);
    await sharp(image)
      .resize({
        height: height,
        width: width
      })
      .toFile(output);
    await sendFileFromThum(thumbnail, res);
  }
);

export default imageRouter;
