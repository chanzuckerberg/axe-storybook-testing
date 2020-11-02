import options from './Options';
import { convertAxeToSarif } from 'axe-sarif-converter';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

/**
 * Outputs results from axe to a file in the Sarif format
 * @param sarifFileName the name of the file that will contain axeResults
 * @param axeResults results to output
 */
export async function exportAxeAsSarifTestResult(sarifFileName: string, axeResults: any) {
  if(options.outputSarifFiles)
  {
    const sarifResults = convertAxeToSarif(axeResults);

    const testResultsDirectory = path.join('.', options.sarifOutputDir);
    await promisify(fs.mkdir)(testResultsDirectory, { recursive: true });

    const sarifResultFile = path.join(testResultsDirectory, sarifFileName);
    await promisify(fs.writeFile)(
      sarifResultFile,
      JSON.stringify(sarifResults, null, 2));
  }
}
