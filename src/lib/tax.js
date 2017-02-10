import {BRACKETS} from './data/brackets.json'

/* getTaxBracket will typically async query a data source, so it is better
* to wire up the code to cope with such behavior */
export const getTaxBrackets = () => {
  return Promise.resolve(BRACKETS)
}

export const findBracket = (brackets, annualSalary) => {
  let i
  for (i = 0; i < brackets.length - 1; i++) {
    if (annualSalary < brackets[i+1].start) {
      break
    }
  }
  return brackets[i]
}

export const calculateTax = (annualSalary, {start, base, perDollar}) => {
  const grossIncome = Math.round(annualSalary / 12)
  const incomeTax = Math.round((base + (annualSalary - start -1) * perDollar) / 12)
  const netIncome = grossIncome - incomeTax
  return {grossIncome, incomeTax, netIncome}
}


