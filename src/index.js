import fs from 'fs'
import path from 'path'
import {PAYROLL_HEADERS} from './lib/model'
import {readStream, transformPayrollStream, writeStream} from './lib/payrollcsv'

const fileReadStream = fs.createReadStream(path.join(__dirname, 'lib', 'data', 'sample-input.csv'))
const fileWriteStream = fs.createWriteStream(path.join(__dirname, 'lib', 'data', 'sample-out.csv'), {encoding: 'utf-8'})
writeStream(
  readStream(fileReadStream, PAYROLL_HEADERS, transformPayrollStream),
  fileWriteStream
)

