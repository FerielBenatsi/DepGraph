#!/usr/bin/env node
import { analyzeProject } from '../analysis/analyze.js';
import { printReport } from '../report/report.js';
import { exportJson } from '../report/export.js';

async function main(): Promise<void> {

    const target = process.argv[2]; //recuperes l'arguent de la ligne de commande
        if (!target) {
        console.error('Usage: depgraph <chemin-du-projet>');
        process.exit(1);
    }

    const result = await analyzeProject(target);
    printReport(result, target);

    // Option --export : on cherche "--export" dans les arguments
    const exportIndex = process.argv.indexOf('--export');
    if (exportIndex !== -1) {
        const outputPath = process.argv[exportIndex + 1] ?? 'graph.json';
        await exportJson(result.graph, outputPath);
        console.log(`\n✓ Graphe exporté vers ${outputPath}`);
    }

}


main().catch((err) => {
    console.error('Erreur :', err);
    process.exit(1);
});