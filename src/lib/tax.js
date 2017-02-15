import {BRACKETS} from '../data/brackets.json'

/* getTaxBracket will typically async query a data source, so it is better
* to wire up the code to cope with such behavior */
export const getTaxBrackets = () => {
  return Promise.resolve(BRACKETS)
}

export const findBracket = (brackets, annualSalary) => {
  return brackets.reduce((acc, bracket) => {
    return annualSalary > bracket.start ? bracket : acc
  })
}

export const calculateTax = (annualSalary, {start, base, perDollar}) => {
  const grossIncome = Math.round(annualSalary / 12)
  const incomeTax = Math.round((base + (annualSalary - start -1) * perDollar) / 12)
  const netIncome = grossIncome - incomeTax
  return {grossIncome, incomeTax, netIncome}
}


