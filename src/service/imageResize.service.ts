import sharp from 'sharp';

import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

export type ImageResizeConfig = {
    input: string,
    output: string,
    width: number,
    height: number
}

export const imageResize = async (config: ImageResizeConfig): Promise<void> => {
    try {
        const image = await readFile(
            path.join(__dirname, '../../assets/full/', config.input + '.jpg')
        );
        const outputImage = path.join(__dirname, '../../assets/thumbnails/',config.output);
        await sharp(image)
            .resize({
                fit: sharp.fit.contain,
                height: config.height,
                width: config.width
            })
            .toFile(outputImage);
    } catch (error) {
        console.error('cannot resize image');
    }
}

