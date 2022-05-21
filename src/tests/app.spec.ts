import app from '../app';
import { imageResize, ImageResizeConfig } from '../service/imageResize.service';

import supertest from 'supertest';

const request = supertest(app);

it('/api is running', async () => {
    const res = await request.get('/api');
    expect(res.text).toContain(`
  Welcome to Image Processing API<br>
  You can use /api/image to resize an image<br>
  or /api/thumb/[imageName] to use it as placeholder
  `);
});

it('/Api/images with invaild name', async () => {
    const res = await request.get(
        '/api/images?filename=zizo&width=500&height=200'
    );
    expect(res.status).toBe(404);
});

it('/Api/images with no name', async () => {
    const res = await request.get('/api/images?filename=&width=5&height=200');
    // console.log(res)
    expect(res.text).toEqual('"Must provid filename"');
});

it('/Api/images with text width', async () => {
    const res = await request.get(
        '/api/images?filename=fjord&width=zizo&height=200'
    );
    expect(res.text).toEqual('"width and height must be numbers"');
});

it('/Api/images with less than 50 width', async () => {
    const res = await request.get(
        '/api/images?filename=fjord&width=5&height=200'
    );
    // console.log(res)
    expect(res.text).toEqual('"width and height must be greater than 50"');
});

it('/Api/images with less than 50 height', async () => {
    const res = await request.get(
        '/api/images?filename=fjord&width=500&height=20'
    );
    // console.log(res)
    expect(res.text).toEqual('"width and height must be greater than 50"');
});

it('resizes image', () => {
    const config: ImageResizeConfig = {
        input: 'fjord',
        output: 'fjord_200_220.jpg',
        width: 200,
        height: 220
    };
    expect(async () => {
        await imageResize(config);
    }).not.toThrow();
});
