import {readdir} from 'node:fs/promises';
import {join} from 'node:path';

/*
parcourir un dossier -> liste de ses fichiers */

export async function scanFolder(folderPath: string): Promise<string[]> {
    const files: string[] = [];                       
    const entries = await readdir(folderPath, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = join(folderPath, entry.name);

        if (entry.isDirectory()) {
            const subFiles = await scanFolder(fullPath);   
            files.push(...subFiles);                      
        } else {
            files.push(fullPath);                          
        }
    }

    return files;                                     
}

scanFolder('src').then((result) => console.log(result));