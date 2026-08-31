import { dirname, join, normalize } from 'node:path';
import {access} from 'node:fs/promises';

const EXTENSIONS_TO_TRY = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];




/**
 * Un import est "local" (donc à résoudre) s'il commence par ./ ou ../
 * Sinon, c'est un package externe ou un module natif → à ignorer.
 */
export function isLocalImport(importPath: string): boolean {
    return importPath.startsWith('./') || importPath.startsWith('../');
}

/**
 * Calcule le chemin de base d'un import local, relatif au fichier qui l'importe.
 * Ex : depuis 'src/App.ts', l'import './components/Button' donne 'src/components/Button'
 * (sans extension pour l'instant).
 */

export function resolveBasePath(fromFile: string, importPath: string): string {
  
    return join(dirname(fromFile), importPath);
}

/** Renvoie true si le fichier existe sur le disque, false sinon. */
async function fileExists(path: string): Promise<boolean> {
    try {
        await access(path);   // réussit si le fichier existe
        return true;
    } catch {
        return false;         // access a levé une erreur → le fichier n'existe pas
    }
}


/**
 * À partir d'un chemin de base sans extension (ex: 'src/components/Button'),
 * essaie de trouver le vrai fichier sur le disque.
 * Renvoie le chemin trouvé, ou null si rien n'existe.
 */

export async function resolveToFile(basePath: string): Promise<string | null> {

    // cas 1: basepath + extension 
    for(const ext of EXTENSIONS_TO_TRY){
        const condidate = normalize(basePath + ext);
        if(await fileExists(condidate)){
            return condidate;
        }
    }
    


    //cas2 : baseapath + /index + extension
    for(const ext of EXTENSIONS_TO_TRY){
        const condidate = normalize(join(basePath, 'index' + ext));
        if(await fileExists(condidate)){
            return condidate;
        }
    }
    
    return null;  // aucun fichier trouvé


    }                                  



    /**
 * Résout un import vers le vrai fichier qu'il désigne.
 * Renvoie null si l'import est externe (react, node:...) ou introuvable.
 */


    export async function resolveImport(
    fromFile: string,
    importPath: string,
): Promise<string | null> {
    // 1. Externe -> pas dans notre graphe
    if (!isLocalImport(importPath)) {
        return null;
    }

    // 2. Local -> on calcule le chemin de base puis on cherche le vrai fichier
    const basePath = resolveBasePath(fromFile, importPath);
    return resolveToFile(basePath);
}