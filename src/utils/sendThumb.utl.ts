import express from 'express';

export const sendFileFromThum = async (
    thumbnail: string,
    res: express.Response
): Promise<void> => {
    res.send(`<img src="http://localhost:3000/api/thumb/${thumbnail}" />`);
};
