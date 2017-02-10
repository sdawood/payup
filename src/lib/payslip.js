import {getTaxBrackets, findBracket, calculateTax} from './tax'

export const generate = ({firstName, lastName, annualSalary, superRate, paymentStartDate}) => {
  let taxRecord
  return getTaxBrackets()
    .then(brackets => findBracket(brackets, annualSalary))
    .then(bracket => calculateTax(annualSalary, bracket))
    .then(({grossIncome, incomeTax, netIncome }) => {
      return {
        fullName: `${firstName} ${lastName}`,
        paymentStartDate,
        grossIncome,
        incomeTax,
        netIncome,
        superAmount: Math.round(grossIncome * superRate)
      }
    }).catch(err => {
      console.error(err)
      throw err
    })
}