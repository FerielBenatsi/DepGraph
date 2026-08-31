import { describe, it, expect } from 'vitest';
import { parseImports } from '../src/parser/parser.js';

describe('parseImports', () => {
    it('extrait les imports réels et ignore commentaires et chaînes', async () => {
        const imports = await parseImports('tests/fixtures/imports-sample.ts');

        expect(imports).toHaveLength(3);                          // exactement 3
        expect(imports).toContain('./components/Button');         
        expect(imports).toContain('./App');                      
        expect(imports).toContain('./utils');                    
        expect(imports).not.toContain('./commentaire-piege');    // le commentaire est ignoré
        expect(imports).not.toContain('./chaine-piege');         // la chaîne est ignorée
    });
});