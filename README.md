[![Build Status](https://travis-ci.org/sdawood/payup.png?branch=master)](https://travis-ci.org/sdawood/payup)

# payup
Simple payroll processor

## Pre-requisits
You need to have node installed, ^6.0.0 for ES6 Promises support without a polyfill
You can install node for your operating system from [the node website](https://nodejs.org/)
Node installation should install npm as well

## Installation

Since the package is not yet available on npm, clone the repo using git

```
$ git clone https://github.com/sdawood/payup.git
$ cd payup
```

Install the dependecies using npm

```
npm install
```

Build es2015 code into valied ES5 code

```
npm run build
```

## Usage

The package entry point is dist/index.js
Execute the file with -h argument to see a full help message

```
$ node dist/index.js -h
```

This hould display the usage documentation

```
Generate payslip from salary records.
Usage: dist/index.js [options]

Options:
  -i, --input   CSV file with payroll entries, or space separated list of files
                                                              [array] [required]
  -o, --outDir  Output directory                                      [required]
  -f, --force   Create outDir if not existing
  -h, --help    Show help                                              [boolean]

Examples:
  dist/index.js --input
  /path/to/payroll1.csv --out-dir
  /data/payslips/

copyright 2017, License: MIT
```

## Example

In this example we use the included sample-input.csv file, we also use the --force flag to force generate the output directory if no existing

```
$ node dist/index.js -i dist/data/sample-input.csv -o ./payslip -f
```

After the program completes sucessfully, the ./payslip directory should include a file with the same name as the input, including the payslip data rows

```
$ cat ./payslip/sample-input.csv

David Rudd,01 March – 31 March,5004,922,4082,450
Ryan Chen,01 March – 31 March,10000,2696,7304,1000
```

You can also pass a space separated list of input file names to -i argument to batch generate payslips for more than one file


## Running test and coverage

To run the tests

```
npm run test
```

To run the tests and gerenate a test coverage report
```
npm run coverage
```

## Discusson and future roadmap

The design, while minimal, relies on Node Streams. This means that the file is not fully loaded in memory, which enables working on large files without working about consuming too much memory on the server.

CSV trasformation is achieved through piping streams together, for example FileReadStream -> CSVReadStream -> * TrasformStream -> CSVWriteStream -> FileWriteStream

This architecture allows for a wide range of scenarios, for instance:
* Pipe HTTP Request stream to parse an uploaded CSV file on the fly, without buffering the while file to memory or writing to disk.
* The above setup can be further extended to allow downloading the result throug piping the a WriteStream with HTTP response.
* The pipes can be rearranged to add extra validation and/ore transformations

The above design also allow for flexible testing with MemoryStreams, without the need to rely on csv files to execute test suite.

\* Currently CSVReadStream is using a transport function implicitly

### Roadmap

For backlog, check 'enhancement' [issues](https://github.com/sdawood/payup/issues) in this repo



