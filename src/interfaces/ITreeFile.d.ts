export default interface ITreeFile {
  name: string;
  isParam: boolean;
  files: string[];
  folders: ITreeFile[];
}
