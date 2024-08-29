const {
  readdirSync,
  statSync,
  renameSync,
  readFileSync,
  writeFileSync
} = require('fs');
const { join, extname, basename } = require('path');

const directory = './dist';

const renameFilesAndModifyImports = (dir) => {
  readdirSync(dir).forEach((file) => {
    const fullPath = join(dir, file);

    if (statSync(fullPath).isDirectory()) {
      renameFilesAndModifyImports(fullPath);
    } else {
      const ext = extname(file);
      if (ext === '.js' || ext === '.mjs') {
        const newFile = basename(file, ext) + '.cjs';
        const newFullPath = join(dir, newFile);
        renameSync(fullPath, newFullPath);

        // Read and modify the content of the file
        let content = readFileSync(newFullPath, 'utf-8');
        content = content.replace(
          /(require|import)\(['"](.+?)['"]\)/g,
          (match, p1, p2) => {
            if (
              typeof p2 === 'string' &&
              (p2.endsWith('.js') || p2.endsWith('.mjs'))
            ) {
              return `${p1}('${p2.replace(/\.js|\.mjs/, '.cjs')}')`;
            }
            return match;
          }
        );

        writeFileSync(newFullPath, content, 'utf-8');
      }
    }
  });
};

renameFilesAndModifyImports(directory);
