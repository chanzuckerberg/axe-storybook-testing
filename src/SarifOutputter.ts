import options from './Options';
import { AxeResults } from 'axe-core';
import { convertAxeToSarif } from 'axe-sarif-converter';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

/**
 * Outputs results from axe to a file in the SARIF format
 * @param sarifFileName the name of the file that will contain axeResults
 * @param axeResults results to output
 */
export async function exportAxeAsSarifTestResult(sarifFileName: string, axeResults: AxeResults) {
  if(options.outputSarifFiles)
  {
    const sarifResults = convertAxeToSarif(axeResults);
    const testResultsDirectory = await makeDirectory(options.sarifOutputDir);

    const sarifResultFile = path.join(testResultsDirectory, sarifFileName);
    await promisify(fs.writeFile)(
      sarifResultFile,
      JSON.stringify(sarifResults, null, 2));
  }
}

async function makeDirectory(directory: string) : Promise<string>{
  const outputDirectory = path.join('.', directory);
  return promisify(fs.mkdir)(outputDirectory, { recursive: true });
}
