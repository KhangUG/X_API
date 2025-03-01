import { NextFunction, Request, Response } from 'express'
import HTTP_STATUS from '../constants/httpStatus'
import formidable from 'formidable'
import path from 'path'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const form = formidable({
    uploadDir: path.resolve('uploads'),
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 300 * 1024 * 1024
  })
  form.parse(req, (err, fields, files) => {
    if (err) {
      throw err
    }
    res.json({
      message: 'Image uploaded successfully'
    })
  })
}
