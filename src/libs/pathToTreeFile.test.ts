import { NoPathExistError, NoFileExistError } from '../classes/Error';
import ITreeFile from '../interfaces/TreeFile.inteface';
import { pathToTreeFile, getModuleByUrl } from './pathToTreeFile';

// getModuleByUrl
let initTree: ITreeFile;
beforeEach(() => {
  initTree = pathToTreeFile('./test');
});

describe('pathToTreeFile', () => {
  test('get empty folder', () => {
    const tree: ITreeFile = pathToTreeFile('./test/api/empty');
    expect(tree.files.length).toBe(0);
    expect(tree.folders.length).toBe(0);
  });

  test('get folder with subfolder and no files', () => {
    const tree: ITreeFile = pathToTreeFile('./test/api/folder');
    expect(tree.files.length).toBe(0);
    expect(tree.folders.length).toBe(2);
  });

  test('get folder with filder and without folders', () => {
    const tree: ITreeFile = pathToTreeFile('./test/api/files');
    expect(tree.files.length).toBe(3);
    expect(tree.folders.length).toBe(0);
  });

  test('get deep file', () => {
    const tree: ITreeFile = pathToTreeFile('./test');

    // get "api" folder
    const apiFolder: ITreeFile | undefined = tree.folders.find((folder) => folder.name === 'api');
    expect(apiFolder).not.toBeUndefined();

    if (!apiFolder) {
      return;
    }

    // get "file" folder
    const filesFolder: ITreeFile | undefined = apiFolder.folders.find((folder) => folder.name === 'files');
    expect(filesFolder).not.toBeUndefined();

    if (!filesFolder) {
      return;
    }

    expect(filesFolder.files.length).toBe(3);
    expect(filesFolder.files).toContain('1.get.ts');
  });
});

describe('getModuleByUrl', () => {
  test('test NoPathExistError', () => {
    const t = () => {
      getModuleByUrl('test/api/nopath', initTree);
    };
    expect(t).toThrow(NoPathExistError);
  });

  test('test NoFileExistError', () => {
    // expect(initTree).toBe(0);
    const t = () => {
      getModuleByUrl('api/files/1.post.ts', initTree);
    };
    expect(t).toThrow(NoFileExistError);
  });

  test('url with params', () => {
    // expect(initTree).toBe(0);
    const { pathname } = getModuleByUrl('api/files/1.get.ts', initTree);
    expect(pathname).toBe('api/files/1.get.ts');
  });

  test('url without params', () => {
    const { pathname, params } = getModuleByUrl('api/files/2.get.ts', initTree);
    expect(pathname).toBe('api/files/[id].get.ts');
    expect(params).toMatchObject({ id: '2' });
  });

  test('custon folder', () => {
    const { pathname, params } = getModuleByUrl('api/folder/1/test.get.ts', initTree);
    expect(pathname).toBe('api/folder/[id]/[type].get.ts');
    expect(params).toMatchObject({ id: '1', type: 'test' });
  });

  test('file with _ or -', () => {
    const { pathname, params } = getModuleByUrl('api/folder/1/admin-type.get.ts', initTree);
    expect(pathname).toBe('api/folder/[id]/admin-type.get.ts');
    expect(params).toMatchObject({ id: '1' });
  });

  test('file with param _ or -', () => {
    const { pathname, params } = getModuleByUrl('api/folder/1/admin-_type.get.ts', initTree);
    expect(pathname).toBe('api/folder/[id]/[type].get.ts');
    expect(params).toMatchObject({ id: '1', type: 'admin-_type' });
  });
});
