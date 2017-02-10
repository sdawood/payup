import fs from 'fs'
import path from 'path'
import csv from 'fast-csv'

import {PAYSLIP_HEADERS} from './model'
import {generate} from './payslip'

// readStream, headers, fn -> ReadStream
export const readStream = (fileReadStream, headers, transform) => {
  // const fileReadStream = fs.createReadStream(filePath)
  const inputCSVStream = csv.fromStream(fileReadStream, {headers})
  if(transform) {
    inputCSVStream.transform(transform)
  }
  return inputCSVStream
}

// readStream, writeStream -> writeStream
export const writeStream = (csvReadStream, writeStream) => {
  return csvReadStream
    .pipe(csv.createWriteStream())
    .pipe(writeStream)
}

export const transformPayrollStream = ({firstName, lastName, annualSalary, superRatePercent, paymentStartDate}, next) => {
  const superRate = parseInt(superRatePercent.replace('%', '')) * .01
  generate({firstName, lastName, annualSalary, superRate, paymentStartDate})
    .then((payslipRecord => {
      next(null, PAYSLIP_HEADERS.map(field => payslipRecord[field]))
    }))
    .catch(err => {
      console.error(err)
      throw err
    })
}