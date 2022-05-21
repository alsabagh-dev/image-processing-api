import express from 'express';
import { error } from '../../../utils/error.utl';

export const validateReq = (
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
