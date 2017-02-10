import {expect} from 'chai'
import {findBracket, getTaxBrackets, calculateTax} from './tax'

describe('tax', () => {
  describe('#findBracket', () => {
    it('should return bracket for a given income value', () => {
      const annualSalary = 100000
      const expected = {start: 80001, base: 17547, perDollar: 0.37}
      getTaxBrackets()
        .then(brackets => {
          const result = findBracket(brackets, annualSalary)
          expect(result).to.eql(expected)
        })
    })

    it('should accept negative value', () => {
      const annualSalary = -1
      const expected = {start: 0, base: 0, perDollar: 0}
      getTaxBrackets()
        .then(brackets => {
          const result = findBracket(brackets, annualSalary)
          expect(result).to.eql(expected)
        })
    })

    it('should accept values greater than brackets ceiling', () => {
      const annualSalary = 180002
      const expected = {start: 180001, base: 54547, perDollar: 0.45}
      getTaxBrackets()
        .then(brackets => {
          const result = findBracket(brackets, annualSalary)
          expect(result).to.eql(expected)
        })
    })

    it('should return same bracket for values higher than ceiling', () => {
      const annualSalary1 = 200000
      const annualSalary2 = 500000
      getTaxBrackets()
        .then(brackets => {
          const result1 = findBracket(brackets, annualSalary)
          const result2 = findBracket(brackets, annualSalary2)
          expect(result2).to.eql(result1)
        })
    })

    it('should not limit ambition!', () => {
      const annualSalary = Infinity
      const expected = {start: 180001, base: 54547, perDollar: 0.45}
      getTaxBrackets()
        .then(brackets => {
          const result = findBracket(brackets, annualSalary)
          expect(result).to.eql(expected)
        })
    })
  })

  describe('#calculateTax', () => {
    it('should calculate grossIncome, incomeTax and netIncome for a given value', () => {
      const annualSalary = 60050
      const taxBracket = {"start": 37001, "base": 3572, "perDollar": 0.325}
      const expected = {grossIncome: 5004, incomeTax: 922, netIncome: 4082}
      const result = calculateTax(annualSalary, taxBracket)
      expect(result).to.eql(expected)
    })

    it('should handle negative income?', () => {
      const annualSalary = -1000
      const taxBracket = {"start": 0, "base": 0, "perDollar": 0}
      const expected = {grossIncome: Math.round(annualSalary/12), incomeTax: 0, netIncome: Math.round(annualSalary/12)}
      const result = calculateTax(annualSalary, taxBracket)
      expect(result).to.eql(expected)
    })

    it('should calculate net income to equal gross income in case of zero income', () => {
      const annualSalary = 0
      const taxBracket = {"start": 0, "base": 0, "perDollar": 0}
      const expected = {grossIncome: Math.round(annualSalary/12), incomeTax: 0, netIncome: Math.round(annualSalary/12)}
      const result = calculateTax(annualSalary, taxBracket)
      expect(result).to.eql(expected)
    })

    it('should calculate net income to equal gross income in case of exempted income', () => {
      const annualSalary = 18200
      const taxBracket = {"start": 0, "base": 0, "perDollar": 0}
      const expected = {grossIncome: Math.round(annualSalary/12), incomeTax: 0, netIncome: Math.round(annualSalary/12)}
      const result = calculateTax(annualSalary, taxBracket)
      expect(result).to.eql(expected)
    })
  })
})