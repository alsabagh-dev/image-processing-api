import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { error } from '../../../utils/error.utl';
import { getThumbnailName } from '../../../utils/getThumName.utl';
import { sendFileFromThum } from '../../../utils/sendThumb.utl';

const readFile = promisify(fs.readFile);
const access = promisify(fs.access);
const mkdir = promisify(fs.mkdir);

const checkIfThumb = async (
    thumbPath: fs.PathLike,
    res: express.Response
): Promise<void> => {
    // Check if Thumbnails directory exists
    try {
        await access(thumbPath);
    } catch (accessError) {
        // create Thumbnails directory
        try {
            await mkdir(thumbPath);
        } catch (createError) {
            console.error('Cannot create Thumbnails directory');

            const msg =
                'Sorry we are encountering some internal issue/n pleae try again later';
            error(500, msg, res);
        }
    }
};

export const getImageFromThumbnail = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    const filename = req.query.filename as unknown as string;
    const width = parseInt(req.query.width as unknown as string);
    const height = parseInt(req.query.height as unknown as string);
    const thumbnail = getThumbnailName(filename, width, height);
    const thumbPath = path.join(__dirname, '../../../../assets/thumbnails');

    // make sure Thumbnails dir exists
    await checkIfThumb(thumbPath, res);

    // check if the requested image already in Thumbnails directory
    try {
        await readFile(path.join(thumbPath, thumbnail));
        sendFileFromThum(thumbnail, res);
    } catch (error) {
        // if not continue the response process
        next();
    }
};
