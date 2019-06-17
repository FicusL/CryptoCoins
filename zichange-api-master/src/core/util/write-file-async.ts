import * as fs from 'fs';

export async function writeFileAsync(fileName: string, data: Buffer): Promise<void> {
  return new Promise(((resolve, reject) => {
    fs.writeFile(fileName, data, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  }));
}