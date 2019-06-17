import * as fs from 'fs';

export async function removeFileAsync(fileName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.unlink(fileName, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}