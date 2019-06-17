import * as fs from 'fs';

export async function readFileAsync(fileName: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, buffer) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(buffer);
    });
  });
}