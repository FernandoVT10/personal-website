import { createWriteStream, ReadStream } from "fs";

export default (fileStream: ReadStream, path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fileStream
      .on("error", e => reject(e))
      .pipe(createWriteStream(path))
      .on("error", e => reject(e))
      .on("finish", () => resolve(path))
  });
}
