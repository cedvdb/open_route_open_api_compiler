import { FailureResponse, HandlerResponse, HttpMethod, OkResponse, Response, Route } from 'open_route';
import { AppFileInfo } from '../multipart/app_file_info';


export interface FileUploadRequest {
  body: {
    /**
     * @description the bucket into which the file is going to be stored
     * @example avatars
     */
    bucket: 'avatars' | 'images';
    /**
     * @description the file to upload
     * @type string
     * @format binary
     */
    file: AppFileInfo;
  };
}

export interface FileUploadResponseBody {
  fileSize: number;
}

/**
 * @summary Upload a file to a bucket
 * @description This is a description
 * 
 * on multiple lines
 * @consumes multipart/form-data
 */
export class FileUploadRoute implements Route<FileUploadRequest, FileUploadResponseBody> {
  readonly path = '/files/upload';
  readonly method = HttpMethod.post;

  async handle(request: FileUploadRequest): Promise<HandlerResponse<FileUploadResponseBody>> {
    const fileSize = request.body.file.bytes.length;
    if (fileSize > 100000) {
      return new FailureResponse(400, 'File cannot be bigger than 100 000 bytes');
    }
    return new OkResponse({ fileSize: request.body.file.bytes.length });
  }

}

