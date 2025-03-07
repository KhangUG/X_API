import { Request } from 'express'
import { getNameFromFullName, handleUploadImage, handleUploadVideo } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import path from 'path'

import fsPromise from 'fs/promises'


import { MediaType } from '~/constants/enums'
import { Media } from '~/models/Other'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'
import { envConfig, isProduction } from '~/constants/config'
import { uploadFileToS3 } from '~/utils/s3'
import mime from 'mime'
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'

class MediasService {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename)
        const newFullFilename = `${newName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, newFullFilename)
        await sharp(file.filepath).jpeg().toFile(newPath)
        const s3Result = await uploadFileToS3({
          filename: newFullFilename,
          filepath: newPath,
          contentType: mime.getType(newPath) as string
        })
        await Promise.all([fsPromise.unlink(file.filepath), fsPromise.unlink(newPath)])

        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.Image
        }
      })
    )
    return result
  }

  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)
    const { newFilename } = files[0]
    return {
      url: isProduction
        ? `${envConfig.host}/static/${newFilename}`
        : `http://localhost:${envConfig.port}/static/video/${newFilename}`,
      type: MediaType.Video
    }
  }
  async uploadVideoHLS(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        await encodeHLSWithMultipleVideoStreams(file.filepath)
        const newName = getNameFromFullName(file.newFilename)
        await fsPromise.unlink(file.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/static/video-hls/${newName}`
            : `http://localhost:${process.env.PORT}/static/video-hls/${newName}`,
          type: MediaType.HLS
        }
      })
    )
    return result
  }
}

const mediasService = new MediasService()

export default mediasService
