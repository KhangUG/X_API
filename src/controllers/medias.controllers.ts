import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import mediasService from '~/services/medias.services'
import fs from 'fs'

export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadImage(req)
  res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
  return
}

export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadVideo(req)
  res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
  return
}
export const uploadVideoHLSController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadVideoHLS(req)
  res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
  return
}

export const serveImageController = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
    if (err) {
      res.status((err as any).status).send('Not found')
    }
  })
}

export const serveVideoStreamController = (req: Request, res: Response, next: NextFunction) => {
  const range = req.headers.range
  if (!range) {
    res.status(HTTP_STATUS.BAD_REQUEST).send('Require range header')
    return
  }
  const { name } = req.params
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, name)
  //1MB = 10^6 bytes
  const videoSize = fs.statSync(videoPath).size //size in bytes
  const chunkSize = 10 ** 6 //1MB
  const start = Number(range.replace(/\D/g, '')) // lấy số từ range
  const end = Math.min(start + chunkSize, videoSize - 1) //end phải nhỏ hơn videoSize
  const contentLength = end - start + 1 // dung luong thuc su cua chunk
  const contentType = 'video/mp4'
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers)
  const videoStreams = fs.createReadStream(videoPath, { start, end })
  videoStreams.pipe(res)
}
