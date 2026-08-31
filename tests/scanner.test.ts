import { describe, it, expect } from 'vitest';
import { scanFolder } from '../src/scanner/scanner.js';

describe('scanFolder', () => {
    it('trouve les fichiers de code et ignore node_modules et les non-sources', async () => {

        const files = await scanFolder('tests/fixtures/sample');

    
        expect(files).toHaveLength(3);                                  
        expect(files.some((f) => f.endsWith('a.ts'))).toBe(true);      
        expect(files.some((f) => f.endsWith('c.ts'))).toBe(true);     
        expect(files.some((f) => f.includes('node_modules'))).toBe(false); 
        expect(files.some((f) => f.endsWith('readme.md'))).toBe(false);    
    });
});