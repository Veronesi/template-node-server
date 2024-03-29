import fs from 'fs';
import path from 'path';
import ITreeFile from '../interfaces/TreeFile.inteface';
import IModulePath from '../interfaces/IModulePath';
import { NoPathExistError, NoFileExistError } from '../classes/Error';

interface IPropos {
  [key: string]: string;
}

export const pathToTreeFile = (_path: string, pathRoot: string = ''): ITreeFile => {
  const directoryPath: string = path.join(__dirname, `${pathRoot}${_path}`);
  const dir: string[] = fs.readdirSync(directoryPath).filter((e) => !/\.map$/.exec(e));

  const files: string[] = dir.filter((file) => file.includes('.'));
  const folders: string[] = dir.filter((folder) => !folder.includes('.'));

  const foldersObejct: ITreeFile[] = folders.map((e) => pathToTreeFile(e, `${pathRoot}${_path}/`));

  // check if some dinamic files with same method
  const dinamicFiles: string[] = files.filter((e) => e.includes('[')).map((e) => e.replace(/\[.*]\./, '').replace(/\.(js|ts)/, ''));

  if (dinamicFiles.length !== new Set(dinamicFiles).size) {
    throw new Error(directoryPath);
  }

  // check if some dinamic folders
  if (foldersObejct.filter((e) => e.isParam).length > 1) {
    throw new Error(directoryPath);
  }

  return {
    name: _path,
    isParam: _path.includes('['),
    files,
    folders: foldersObejct,
  };
};

export const getModuleByUrl = (url: string, tree: ITreeFile): IModulePath => {
  // check if subfolder
  if (url.includes('/')) {
    // parse url
    const { pathname = '', nextpath = '' } = /^(?<pathname>(?:\w+|[-_])*)\/(?<nextpath>.*)$/.exec(url)?.groups || {};
    // check if exist static folder
    const staticFolder: ITreeFile | undefined = tree.folders.find((folder) => folder.name === pathname);
    if (staticFolder) {
      const res = getModuleByUrl(nextpath, staticFolder);
      return {
        pathname: `${staticFolder.name}/${res.pathname}`,
        params: res.params,
      };
    }

    const dinamicFolder: ITreeFile | undefined = tree.folders.find((folder) => folder.isParam);
    if (dinamicFolder) {
      const res: IModulePath = getModuleByUrl(nextpath, dinamicFolder);

      const params: IPropos = {};
      const keyparam: string = /^\[(?<nameparam>.*)\]$/.exec(dinamicFolder.name)?.groups?.nameparam ?? '';
      const param: string = /^(?<nameparam>\w+)\/.*$/.exec(url)?.groups?.nameparam ?? '';
      params[keyparam] = param;

      return {
        pathname: `${dinamicFolder.name}/${res.pathname}`,
        params: { ...res.params, ...params },
      };
    }

    // no folder exist
    throw new NoPathExistError('no path exist');
  }

  // check if static file exist
  const staticFile: boolean = tree.files.map((e) => e.replace(/(js|ts)$/, '')).includes(url.replace(/(js|ts)$/, ''));
  if (staticFile) {
    return {
      pathname: url,
      params: {},
    };
  }

  // check and get dinamic file
  const paramFiles: string[] = tree.files.filter((file) => /^\[(?<nameparam>.*)\]+\.(?<method>(\w+))\.(js|ts)$/.exec(file));

  if (!paramFiles.length) {
    throw new NoFileExistError(`no file exist: ${url}`);
  }

  // get method
  const method = /^.*\.(?<method>\w+)\./.exec(url)?.groups?.method || 'get';

  // check if is same method paramFile
  const paramFile: string = paramFiles.find((file: string) => file.includes(`.${method}.`)) || '';
  if (!paramFile) {
    throw new NoFileExistError(`no file exist: ${url}`);
  }

  const params: IPropos = {};
  const keyparam: string = /^\[(?<nameparam>.*)\]\.\w+\.(js|ts)$/.exec(paramFile)?.groups?.nameparam ?? '';
  const param: string = /^(?<nameparam>(?:\w+|[-_])*)\.\w+\.(js|ts)$/.exec(url)?.groups?.nameparam ?? '';
  params[keyparam] = param;

  return {
    pathname: paramFile,
    params,
  };
};
