export default interface TreeFile {
  name: string;
  isParam: boolean;
  files: string[];
  folders: TreeFile[];
}
