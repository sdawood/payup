import fs from 'fs'
import path from 'path'
import {processFile} from './lib/payrollcsv'

const outFilepath = (outDir, inFilepath) => {
  const filename = path.basename(inFilepath)
  return path.join(outDir, filename)
}

export const main = ({input: inFiles, outDir, force}) => {
  outDir = path.resolve(outDir)

  if (!fs.existsSync(outDir)) {
    if(force) {
      fs.mkdirSync(outDir)
    } else {
      console.error(`Error: no such directory ${outDir}`)
      process.exit(1)
    }
  }

  inFiles
    .map(inFile => path.resolve(inFile))
    .map(inFile => {
      try {
        processFile(inFile, outFilepath(outDir, inFile))
      } catch(err) {
        console.error(err)
        process.exit(1)
      }
    })
}