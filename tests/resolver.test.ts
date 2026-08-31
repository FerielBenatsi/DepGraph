import { describe, it, expect } from 'vitest';
import { isLocalImport, resolveBasePath, resolveToFile ,   resolveImport, } from '../src/resolver/resolver.js';


import { join } from 'node:path';
describe('isLocalImport', () => {
    it('reconnaît les imports locaux', () => {
        expect(isLocalImport('./Button')).toBe(true);
        expect(isLocalImport('../utils/helpers')).toBe(true);
    });

    it('reconnaît les imports externes', () => {
        expect(isLocalImport('react')).toBe(false);
        expect(isLocalImport('node:fs/promises')).toBe(false);
        expect(isLocalImport('lodash')).toBe(false);
    });
});

describe('resolveBasePath', () => {
    it('calcule le chemin relatif au fichier importateur', () => {
        expect(resolveBasePath('src/App.ts', './components/Button'))
            .toBe(join('src', 'components/Button'));

        expect(resolveBasePath('src/pages/Home.ts', '../App'))
            .toBe(join('src', 'App'));
    });
});


describe('resolveToFile', () => {
    it('trouve un fichier en ajoutant la bonne extension', async () => {
        // 'tests/fixtures/sample/a' doit se résoudre en '.../a.ts'
        const result = await resolveToFile('tests/fixtures/sample/a');
        expect(result).toBe(join('tests/fixtures/sample', 'a.ts'));
    });

    it('renvoie null quand aucun fichier ne correspond', async () => {
        const result = await resolveToFile('tests/fixtures/sample/nexiste-pas');
        expect(result).toBeNull();
    });
});


describe('resolveImport', () => {
    it('résout un import local vers son fichier réel', async () => {
        // depuis sample/b.js, l'import './a' doit trouver sample/a.ts
        const result = await resolveImport('tests/fixtures/sample/b.js', './a');
        expect(result).toBe(join('tests/fixtures/sample', 'a.ts'));
    });

    it('renvoie null pour un import externe', async () => {
        const result = await resolveImport('tests/fixtures/sample/b.js', 'react');
        expect(result).toBeNull();
    });

    it('renvoie null pour un import local introuvable', async () => {
        const result = await resolveImport('tests/fixtures/sample/b.js', './fantome');
        expect(result).toBeNull();
    });
});