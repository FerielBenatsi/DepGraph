import type { AnalysisResult } from '../types.js';

/** Affiche le rapport d'analyse dans le terminal. */
export function printReport(result: AnalysisResult, projectName: string): void {
    console.log('=====================================');
    console.log('          DEPGRAPH REPORT');
    console.log('=====================================\n');
    console.log(`Project: ${projectName}\n`);

    console.log(`Files:              ${result.fileCount}`);
    console.log(`Dependencies:       ${result.dependencyCount}\n`);

    console.log(`Circular imports:   ${result.cycles.length}\n`);

    console.log(`Average fan-in:     ${result.averageFanIn.toFixed(1)}`);
    console.log(`Average fan-out:    ${result.averageFanOut.toFixed(1)}\n`);

    console.log('Critical modules:');
    for (const hub of result.hubs) {
        console.log(`  ${hub.path.padEnd(30)} fan-in: ${hub.fanIn}`);
    }
    console.log('');

    if (result.cycles.length > 0) {
        console.log('Circular dependencies:');
        result.cycles.forEach((cycle, i) => {
            const paths = cycle.map((id) => result.graph.nodes[id]);
            console.log(`  Cycle #${i + 1}  ${paths.join(' → ')}`);
        });
        console.log('');
    }

    console.log('=====================================');
}