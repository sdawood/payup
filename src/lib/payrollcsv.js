import fs from 'fs'
import path from 'path'
import csv from 'fast-csv'
import through2 from 'through2'

import {PAYSLIP_HEADERS, PAYROLL_HEADERS} from './model'
import {generate} from './payslip'

// readStream, headers, fn -> ReadStream
export const readStream = (fileReadStream, headers) => {
  const inputCSVStream = csv.fromStream(fileReadStream, {headers,  strictColumnHandling: true})

  inputCSVStream.on("data-invalid", (data) => {
    console.error(`CSV stream read error: Rejected record: [${data}]`)
  })

  return inputCSVStream
}

export const transformStream = through2.obj(function(chunk, enc, callback) {
  transformPayrollStream(chunk, callback)
})

// readStream, writeStream -> writeStream
export const writeStream = () => {
  return csv.createWriteStream()
}

export const transformPayrollStream = ({firstName, lastName, annualSalary, superRatePercent, paymentStartDate}, next) => {
  const superRate = parseInt(superRatePercent.replace('%', '')) * .01
  annualSalary = parseInt(annualSalary)
  if(Number.isNaN(superRate) || Number.isNaN(annualSalary)) {
    console.error('Invalid numeric values')
    next(null, null)
    return
  }
  generate({firstName, lastName, annualSalary, superRate, paymentStartDate})
    .then((payslipRecord => {
      next(null, PAYSLIP_HEADERS.map(field => payslipRecord[field]))
    }))
    .catch(err => {
      console.error(err)
      next(err)
    })
}

export const processFile = (inFilepath, outFilepath) => {
  console.log(`Processing file: ${inFilepath} -> ${outFilepath}`)
  const fileReadStream = fs.createReadStream(inFilepath)
  const fileWriteStream = fs.createWriteStream(outFilepath)
  readStream(fileReadStream, PAYROLL_HEADERS)
    .pipe(transformStream)
    .pipe(writeStream())
    .pipe(fileWriteStream)
}
