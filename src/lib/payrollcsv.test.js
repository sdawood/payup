import {expect} from 'chai'
import csv from 'fast-csv'
import MemoryStream from 'memorystream'

import {readStream, writeStream, transformPayrollStream} from './payrollcsv'
import {PAYROLL_HEADERS, PAYSLIP_HEADERS} from './model'

describe('csv', () => {
  describe('#readStream', () => {
    it('should return a readStream with parsed CSV input and a pass through transform', (done) => {
      /*http://stackoverflow.com/questions/23141226/tdd-testing-with-streams-in-nodejs*/
      const testdata = 'David,Rudd,60050,9%,01	March	– 31	March\n'
      const memReadStream = MemoryStream.createReadStream(testdata)
      const memWriteStream = MemoryStream.createWriteStream(null, {objectMode: true})

      const csvReadStream = readStream(memReadStream, PAYROLL_HEADERS, (record, next) => {
        next(null, record)
      })
      csvReadStream
        .pipe(memWriteStream)
        .on('finish', () => {
          expect(memWriteStream.queue[0]).to.include.keys(PAYROLL_HEADERS)
          done()
        })
    })

    it('should pass through a transformed record into a row array', (done) => {
      const testdata = 'David,Rudd,60050,9%,01	March	– 31	March\n'
      const memReadStream = MemoryStream.createReadStream(testdata)
      const memWriteStream = MemoryStream.createWriteStream(null, {objectMode: true})

      const csvReadStream = readStream(memReadStream, PAYROLL_HEADERS, (record, next) => {
        next(null, PAYROLL_HEADERS.map(field => record[field]))
      })
      csvReadStream
        .pipe(memWriteStream)
        .on('finish', () => {
          expect(memWriteStream.toString()).to.equal(testdata.trim()) //testdata ends with \n
          done()
        })
    })

    it('should reject (not pass through) an invalid record with missing fields', (done) => {
      const testdata = 'David,Rudd,60050,01	March	– 31	March\n'
      const memReadStream = MemoryStream.createReadStream(testdata)
      const memWriteStream = MemoryStream.createWriteStream(null, {objectMode: true})

      const csvReadStream = readStream(memReadStream, PAYROLL_HEADERS, (record, next) => {
        //transform should not be called
        done(record)
      })
    })

    it('should pass through valid records only with expected number of columns', (done) => {
      const oneValidLine =
        `David,Rudd\nRyan,Chen,120000,10%,01	March	– 31	March\n`
      const memReadStream = MemoryStream.createReadStream(oneValidLine)
      const memWriteStream = MemoryStream.createWriteStream(null, {objectMode: true})

      const csvReadStream = readStream(memReadStream, PAYROLL_HEADERS, (record, next) => {
        next(null, record)
      })
      csvReadStream
        .pipe(memWriteStream)
        .on('finish', () => {
          expect(memWriteStream.queue.length).to.equal(1)
          expect(memWriteStream.queue[0]).to.include.keys(PAYROLL_HEADERS)
          expect(memWriteStream.queue[0].firstName).to.equal('Ryan')
          done()
        })
    })

    it('should skip a record through if transform did not call next with data', (done) => {
      const inputCSV =
        `David,Rudd,60050,INVALID%,01	March	– 31	March\nRyan,Chen,120000,10%,01	March	– 31	March\n`
      const memReadStream = MemoryStream.createReadStream(inputCSV)
      const memWriteStream = MemoryStream.createWriteStream(null, {objectMode: true})

      const csvReadStream = readStream(memReadStream, PAYROLL_HEADERS, (record, next) => {
        if(Number.isNaN(parseInt(record.superRatePercent.replace('%', '')))) {
          console.error(`Rejected record: [${JSON.stringify(record)}]`)
          next(null, null)
        } else {
          next(null, record)
        }
      })
      csvReadStream
        .pipe(memWriteStream)
        .on('finish', () => {
          expect(memWriteStream.queue.length).to.equal(1)
          expect(memWriteStream.queue[0]).to.include.keys(PAYROLL_HEADERS)
          expect(memWriteStream.queue[0].firstName).to.equal('Ryan')
          done()
        })
    })


  })

  describe('#writeStream', () => {
    it('should pipe a csvReadStream into a writeStream with CSV formatted row', (done) => {
      const inputCSV =
        `David,Rudd,60050,9%,01	March	– 31	March\nRyan,Chen,120000,10%,01	March	– 31	March\n`
      const csvReadStream = csv.fromString(inputCSV)
      const memWriteStream = MemoryStream.createWriteStream() // objectMode: false, expecting strings

      const csvWriteStream = writeStream(csvReadStream, memWriteStream)
      csvWriteStream
        .on('finish', () => {
          expect(memWriteStream.toString()).to.equal(inputCSV.trim())
          done()
        })
    })
  })

  describe('read-transform-write', () => {
    it('should pipe readStream to writeStream with CSV transform', (done) => {
      const inputCSV =
        `David,Rudd,60050,9%,01	March	– 31	March\n`
      const outputRow = 'David	Rudd,01	March	– 31	March,5004,922,4082,450'

      const memReadStream = MemoryStream.createReadStream(inputCSV)
      const memWriteStream = MemoryStream.createWriteStream()

      const csvReadStream = readStream(memReadStream, PAYROLL_HEADERS, (record, next) => {
        //transform record object into array, mimic transformPayrollStream
        next(null, outputRow.split(','))
      })

      const csvWriteStream = writeStream(csvReadStream, memWriteStream)
      csvWriteStream
        .on('finish', () => {
          expect(memWriteStream.toString()).to.equal(outputRow)
          done()
        })
    })
  })

  describe('#transformPayrollStream', () => {
    it('should call next as part of a transform stream `middleware`', (done) => {
      const payrollRecord = {
        firstName: 'a',
        lastName: 'b',
        annualSalary: 0,
        superRatePercent: '9%',
        paymentStartDate: '01	March	– 31	March'
      }

      transformPayrollStream(payrollRecord, (err, payslipRow) => {
        done(err)
      })
    })

    it('should call next with a valid payslip record', (done) => {
      const payrollRecord = {
        firstName: 'a',
        lastName: 'b',
        annualSalary: 0,
        superRatePercent: '9%',
        paymentStartDate: '01	March	– 31	March'
      }

      transformPayrollStream(payrollRecord, (err, payslipRow) => {
        expect(payslipRow.length).to.equal(PAYSLIP_HEADERS.length)
        expect(payslipRow[0]).to.equal(`${payrollRecord.firstName} ${payrollRecord.lastName}`)
        done(err)
      })
    })

    it('should call next with null for an invalid payroll record: annualSalary', (done) => {
      const payrollRecord = {
        firstName: 'a',
        lastName: 'b',
        annualSalary: 'X',
        superRatePercent: '9%',
        paymentStartDate: '01	March	– 31	March'
      }

      transformPayrollStream(payrollRecord, (err, payslipRow) => {
        done(payslipRow)
      })
    })

    it('should call next with null for an invalid payroll record: superRatePercent', (done) => {
      const payrollRecord = {
        firstName: 'a',
        lastName: 'b',
        annualSalary: '0',
        superRatePercent: 'X%',
        paymentStartDate: '01	March	– 31	March'
      }

      transformPayrollStream(payrollRecord, (err, payslipRow) => {
        done(payslipRow)
      })
    })

  })
})