import express from "express";

export const error = (code: number, msg: string, res: express.Response): void => {
    res.statusMessage = msg;
    res.status(code)
        .json(msg);
};
