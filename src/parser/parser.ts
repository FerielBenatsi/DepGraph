import { parse } from '@typescript-eslint/parser';
import { readFile } from 'node:fs/promises';
/**
 * Lit un fichier et renvoie la liste des modules qu'il importe.
 */

export async function parseImports(filePath: string): Promise<string[]> {

const code = await readFile(filePath, 'utf-8');

const ast = parse(code, {
    sourceType: 'module'});

const imports: string[] = [];

for( const node of ast.body){
    if (node.type === 'ImportDeclaration') {
        imports.push(node.source.value );
    }
}
return imports;


}