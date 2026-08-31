import {readdir} from 'node:fs/promises';
import {join, extname} from 'node:path';
import {ScanOptions} from '../types.js';

/*parcourir un dossier -> liste de ses fichiers */
const DEFAULT_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];
const DEFAULT_IGNORE = ['node_modules', 'dist', 'build', '.git'];

export async function scanFolder(folderPath: string, options: ScanOptions = {},): Promise<string[]> {
      const extensions = options.extensions ?? DEFAULT_EXTENSIONS;
    const ignore = options.ignore ?? DEFAULT_IGNORE;
    const files: string[] = [];                       
    const entries = await readdir(folderPath, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = join(folderPath, entry.name);

        if (entry.isDirectory()) {
            if (ignore.includes(entry.name)) continue;  
            const subFiles = await scanFolder(fullPath, options);   
            files.push(...subFiles);                      
        } else {
            if(extensions.includes(extname(entry.name))) {  
            files.push(fullPath);                          
        }}
    }

    return files;                                     
}

