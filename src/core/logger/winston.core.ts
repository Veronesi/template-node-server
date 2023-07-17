import fs from 'fs';
import path from 'path';

const renderLog = {
  all: async () => {
    try {
      const e = await fs.readFileSync(path.join(__dirname, '../../logs/error.log'), { encoding: 'utf-8', flag: 'r' }).split('\n');
      const json = e
        .filter((f) => f)
        .map((line) => {
          const object = /^{level:\s"(?<level>.*)",\slabel:\s"(?<label>.*)",\stimestamp:\s"(?<timestamp>.*)",\smessage:\s"(?<message>.*)"}$/.exec(
            line
          );
          return object?.groups ? { ...object.groups } : { level: '', label: '', timestamp: '', message: '' };
        });
      return json;
    } catch (error) {
      return [];
    }
  },
  get: async (id: string) => {
    try {
      const e = await fs.readFileSync(path.join(__dirname, `../../logs/${id}.log`), { encoding: 'utf-8', flag: 'r' }).split('\n');
      const json = e
        .filter((f) => f)
        .map((line) => {
          const object = /^{level:\s"(?<level>.*)",\slabel:\s"(?<label>.*)",\stimestamp:\s"(?<timestamp>.*)",\smessage:\s"(?<message>.*)"}$/.exec(
            line
          );
          return object?.groups ? { ...object.groups } : { level: '', label: '', timestamp: '', message: '' };
        });
      return json;
    } catch (error) {
      return [];
    }
  },
};
export { renderLog };
