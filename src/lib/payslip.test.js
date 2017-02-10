import {expect} from 'chai'

import {generate} from './payslip'
import {PAYROLL_HEADERS, PAYSLIP_HEADERS} from './model'

describe('payslip', () => {
  describe('#generate', () => {
    it('return a payslip object with all expected fields populated', () => {
      const inputRecord = {
        firstName: 'a',
        lastName: 'b',
        annualSalary: 0,
        superRate: .09,
        paymentStartDate: '01	March	– 31	March'
      }

      /*by returning the promise, Mocha handles promise rejection if expect fails
      * http://blog.revathskumar.com/2016/11/javascript-testing-promises.html
      * */
      return generate(inputRecord).then(result => {
        expect(result).to.include.keys(PAYSLIP_HEADERS)
      })
    })

    it('should correctly generate payslip records', () => {
      const inputRecord = {
        firstName: 'David',
        lastName: 'Rudd',
        annualSalary: 60050,
        superRate: .09,
        paymentStartDate: '01	March	– 31	March'
      }
      const expected = {
        fullName: `${inputRecord.firstName} ${inputRecord.lastName}`,
        paymentStartDate: inputRecord.paymentStartDate,
        grossIncome: 5004,
        incomeTax: 922,
        netIncome: 4082,
        superAmount: 450
      }
      return generate(inputRecord).then(result => {
        expect(result).to.eql(expected)
      })
    })
  })
})