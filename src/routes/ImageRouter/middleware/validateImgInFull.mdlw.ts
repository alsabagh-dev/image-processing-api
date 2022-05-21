import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { error } from '../../../utils/error.utl';

const readdir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);

const checkIfFull = async (
    thumbPath: fs.PathLike,
    res: express.Response
): Promise<void> => {
    // Check if Thumbnails directory exists
    try {
        const files = await readdir(thumbPath);
        // the 'Full' dir exists and has fils
        if (files.length > 0) {
            files.forEach((file) => {
                if (file.slice(0.4).toLowerCase() === '.jpg') {
                    // the dir exists and has atleaste an image
                    return;
                }
            });
            throw new Error('No images in "Full" assests');
        } else {
            throw new Error('No images in "Full" assests');
        }
    } catch (accessError) {
        // create Thumbnails directory
        try {
            await mkdir(thumbPath);
        } catch (createError) {
            console.error('Cannot create full directory');
        }
        // even if we created the 'Full' dir we need to put images
        const msg =
            'Sorry we are encountering some internal issue/n pleae try again later';
        error(500, msg, res);
    }
};

export const validateImageInFull = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    const filename = (req.query.filename as unknown as string) + '.jpg';
    const fullPath = path.join(__dirname, '../../../../assets/full/');
    const files = await readdir(fullPath);

    // check if 'Full' dir exists and has at least an image (jpg)
    await checkIfFull(fullPath, res);

    if (files.includes(filename)) {
        next();
    } else {
        const msg = `File not found, supported files: ${files
            .map((file) => `${path.parse(file).name}`)
            .join(' - ')}`;
        error(404, msg, res);
    }
};
