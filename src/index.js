import yargs from 'yargs'

import {main} from './clidriver'

const argv = yargs
  .usage('Generate payslip from salary records.\nUsage: $0 [options]')
  .example('$0 --input /path/to/payroll1.csv --out-dir /data/payslips/')
  .alias('i', 'input')
  .describe('i', 'CSV file with payroll entries, or space separated list of files')
  .array('i')
  .alias('o', 'outDir')
  .nargs('o', 1)
  .describe('o', 'Output directory')
  .demandOption(['i', 'o'])
  .alias('f', 'force')
  .describe('f', 'Create outDir if not existing')
  .help('h')
  .alias('h', 'help')
  .epilog('copyright 2017, License: MIT')
  .argv



main(argv)
