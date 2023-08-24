import * as path from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';

export class RotatingLogfile {
  private isProcessing: boolean;
  private queue: string[];

  // private readonly errorLog: string;
  private logFileStream: fs.WriteStream;
  private count: number;
  private checkInterval: number;

  constructor(
    private readonly dir: string,
    private readonly filename: string,
    private readonly maxSize: number,
  ) {
    this.isProcessing = false;
    this.queue = new Array<string>();
    const filepath = path.join(this.dir, filename);
    this.logFileStream = fs.createWriteStream(filepath, { flags: 'a' });
    this.count = 0;
    this.checkInterval = 5;
  }

  putMessage(message: string) {
    const logMessage = `[${new Date().toISOString()}] ${message}\n`;
    this.queue.push(logMessage);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private async processQueue() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    // while(this.queue.length > 0 ) {

    // console.log(this.count);
    this.count++;
    if (this.count % this.checkInterval === 0) {
      // checking the log file for a need of rotation by every message is too often
      await this.rotateLog();
      this.count = 1;
    }
    const message = this.queue.shift(); // Get the first task from the queue
    // await this.rotateLog();
    await this.writeToLog(message);
    //}
    await this.processQueue();
  }

  private async writeToLog(message: string) {
    console.log(message);
    await this.write(message, this.logFileStream);
  }

  private getFileIndex(fileanme: string): number {
    const idx = /\.(\d+)$/.exec(fileanme);
    if (idx !== null) {
      return parseInt(idx[1]);
    }
    return -1;
  }

  private async rotateLog(): Promise<boolean> {
    try {
      const logFilePath = path.join(this.dir, this.filename);
      const fileStats = await fsPromises.stat(logFilePath);
      //   console.log('Size: ' + Math.floor(fileStats.size / 1024) + ' kB');

      if (Math.floor(fileStats.size / 1024) < this.maxSize) {
        return false;
      }

      const files = await fsPromises.readdir(this.dir);

      const re = new RegExp('^' + this.filename + '(\\.\\d+)?$');

      const filtered = files.filter((file) => {
        return re.test(file);
      });

      const idxs = new Array<number>();
      filtered.forEach((file) => {
        const num = this.getFileIndex(file);
        if (num >= 0) idxs.push(num);
      });
      idxs.sort();

      for (let i = idxs.length - 1; i >= 0; i--) {
        if (
          (i > 0 && idxs[i - 1] === idxs[i] - 1) ||
          (i === 0 && idxs[i] === 0)
        ) {
          // there is a logfile with previous index.
          const filepath = path.join(this.dir, this.filename + '.' + idxs[i]);
          if (idxs[i] === 9) {
            console.log(`delete [${filepath}]`);
            await fsPromises.unlink(filepath);
          } else {
            const filepath1 = path.join(
              this.dir,
              this.filename + '.' + (idxs[i] + 1),
            );
            console.log(`rename [${filepath}] to [${filepath1}]`);
            await fsPromises.rename(filepath, filepath1);
          }
        }
      }

      //   console.log('close log stream');
      this.logFileStream.close();
      const filepath = path.join(this.dir, this.filename);
      const filepath1 = path.join(this.dir, this.filename + '.' + 0);
      //   console.log(`rename [${filepath}] to [${filepath1}]`);
      await fsPromises.rename(filepath, filepath1);
      //   console.log(`errors log: ${filepath}`);
      this.logFileStream = fs.createWriteStream(filepath, { flags: 'a' });
      await this.writeToLog('logfile was rotated.\n');
    } catch (error) {
      console.log('Log rotation error: ' + error);
      return false;
    }
    return true;
  }

  private write(data, stream) {
    return new Promise((resolve, reject) => {
      if (stream.write(data, 'utf8')) {
        process.nextTick(resolve);
      } else {
        stream.once('drain', () => {
          stream.off('error', reject);
          resolve;
        });
        stream.once('error', reject);
      }
    });
  }
}
