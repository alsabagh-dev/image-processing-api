import express from 'express';

import { imageResize, ImageResizeConfig } from '../../service/imageResize.service';

import { sendFileFromThum } from '../../utils/sendThumb.utl';
import { getThumbnailName } from '../../utils/getThumName.utl';

import { validateReq } from './middleware/validateReq.mdlw';
import { getImageFromThumbnail } from './middleware/getImgFromThum.mdlw';
import { validateImageInFull } from './middleware/validateImgInFull.mdlw';
import { error } from '../../utils/error.utl';

const imageRouter = express.Router();

imageRouter.get(
  '/',
  validateReq,
  validateImageInFull,
  getImageFromThumbnail,
  async (req: express.Request, res: express.Response)
    : Promise<void> => {
    const filename = req.query.filename as unknown as string;
    const width = parseInt(req.query.width as unknown as string);
    const height = parseInt(req.query.height as unknown as string);

    const thumbnail = getThumbnailName(filename, width, height);
    const config: ImageResizeConfig = {
      input: filename,
      output: thumbnail,
      width: width,
      height: height
    }

    try {
      await imageResize(config);
      await sendFileFromThum(thumbnail, res);  
    } catch (err) {
      // even if we created the 'Full' dir we need to put images 
      const msg = 'Sorry we are encountering some internal issue/n pleae try again later';
      error(500, msg, res)
    }
    
  }
);

export default imageRouter;
