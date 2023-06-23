import createBusboy from 'busboy';
import { NextFunction, Request, Response } from 'express';
import { AppFileInfo } from './app_file_info';


export async function multipartMiddleware(request: Request, response: Response, next: NextFunction) {
  if (request.headers['content-type']?.includes('multipart/form-data')) {
    (request as any).body = await parseMultiPartFormData(request);
  }
  next();
}

function parseMultiPartFormData(req: Request): Promise<any> {
  const busboy = createBusboy({ headers: req.headers });

  const promise = new Promise((resolve, reject) => {
    const fields: Record<string, unknown> = {};

    busboy.once('close', () => {
      resolve(fields);
    }).once('error', (e) => {
      console.error(e);
      reject(e);
    }).on('field', (name, val) => {
      fields[name] = val;
    }).on('file', (fieldName, file, fileInfo) => {
      file.resume();
      const { filename, mimeType } = fileInfo;
      const chuncks: Uint8Array[] = [];
      file.on('data', (data: Uint8Array) => {
        chuncks.push(data);
      });
      file.on('close', () => {
        const bytes = concatChunks(chuncks);
        const file = { name: filename, mime: mimeType, bytes };
        if (!fields[fieldName]) {
          fields[fieldName] = file;
        } else if (!Array.isArray(fields[fieldName])) {
          fields[fieldName] = [fields[fieldName], file];
        } else {
          fields[fieldName] = [...(fields[fieldName] as Array<AppFileInfo>), file];
        }
      });
      file.on('error', function (err) {
        console.error(err);
      });
    });
  });
  req.pipe(busboy);

  return promise;
}

function concatChunks(chunks: Uint8Array[]) {
  // sum of individual array lengths
  let totalLength = chunks.reduce((acc, value) => acc + value.length, 0);
  let result = new Uint8Array(totalLength);

  // for each array - copy it over result
  // next array is copied right after the previous one
  let length = 0;
  for (let array of chunks) {
    result.set(array, length);
    length += array.length;
  }

  return result;
}