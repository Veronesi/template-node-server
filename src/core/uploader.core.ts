/* eslint-disable no-unused-vars */
import { Express } from 'express';

export default interface UploaderCore {
  uploadFile(file: Express.Multer.File, filename: string): Promise<string>;
  uploadFileByURL(url: string, filename: string): Promise<string>;
}
