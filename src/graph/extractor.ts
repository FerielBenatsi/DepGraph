import { scanFolder } from '../scanner/scanner.js';
import { parseImports } from '../parser/parser.js';
import { resolveImport } from '../resolver/resolver.js';

import { Dependency } from '../types.js';

/**
 * analyser un projet et renvoie les arcs
 * 
 */


export async function extractDependencies(projectPath: string): Promise<Dependency[]> {
const files = await scanFolder(projectPath); //tous les fichies

const dependencies: Dependency[] = [];

for(const file of files){ 
 const imports = await parseImports(file); //tous les imports du fichier
    
   for(const importPath of imports){
    const target = await resolveImport(file, importPath); // le vrai fichier
    if (target !== null){
        dependencies.push({from: file, to: target});
    }
   }
}
return dependencies;
}
/**
extractDependencies('src').then((deps) => console.log(deps));*/