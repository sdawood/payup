[![Build Status](https://travis-ci.org/sdawood/payup.png?branch=master)](https://travis-ci.org/sdawood/payup)

# payup
Simple payroll processor

## Pre-requisites
You need to have node installed, ^6.0.0 for ES6 Promises support without a polyfill
You can install node for your operating system from [the node website](https://nodejs.org/)
Node installation should install npm as well

## Installation

Since the package is not yet available on npm, clone the repo using git

```
$ git clone https://github.com/sdawood/payup.git
$ cd payup
```

Install the dependencies using npm

```
npm install
```

Build es2015 code into valid ES5 code

```
npm run build
```

## Usage

The package entry point is dist/index.js
Execute the file with -h argument to see a full help message

```
$ node dist/index.js -h
```

This should display the usage documentation

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

After the program completes successfully, the ./payslip directory should include a file with the same name as the input, including the payslip data rows

```
$ cat ./payslip/sample-input.csv

David Rudd,01 March – 31 March,5004,922,4082,450
Ryan Chen,01 March – 31 March,10000,2696,7304,1000
```

You can also pass a space separated list of input file names to -i argument to batch generate payslips for more than one file


## Running test and coverage

`husky` development dependency makes available the `precommit` npm script, to only allow a commit after a successful test run.

To run the tests

```
npm run test
```

To run the tests and generate a test coverage report
```
npm run coverage
```
Coverage reports can be sent to a 3rd party service, e.g. [codecov.io](http://codecov.io)
To sustain coverage levels, ```npm run check-coverage``` can be run on Travis CLI after the tests and fail the build if coverage falls below the thresholds defined in package.json

```
=============================================================================
Writing coverage object [/Users/sdawood/tmp/payup/coverage/coverage.json]
Writing coverage reports at [/Users/sdawood/tmp/payup/coverage]
=============================================================================

=============================== Coverage summary ===============================
Statements   : 98.17% ( 214/218 )
Branches     : 90% ( 9/10 )
Functions    : 97.18% ( 69/71 )
Lines        : 98.12% ( 209/213 )
================================================================================
```
## Discussion and future roadmap

The design, while minimal, relies on Node Streams. This means that the file is not fully loaded in memory, which enables working on large files without working about consuming too much memory on the server.

CSV transformation is achieved through piping streams together, for example FileReadStream -> CSVReadStream -> * TransformStream -> CSVWriteStream -> FileWriteStream

This architecture allows for a wide range of scenarios, for instance:
* Pipe HTTP Request stream to parse an uploaded CSV file on the fly, without buffering the whole file to memory or writing to disk.
* The above setup can be further extended to allow downloading the result through piping the a WriteStream with HTTP response.
* The pipes can be rearranged to add extra validation and/or transformations

The above design also allow for flexible testing with MemoryStreams, without the need to rely on csv files to execute test suite.

\* Currently CSVReadStream is using a transform function implicitly

### Roadmap

For backlog, check 'enhancement' [issues](https://github.com/sdawood/payup/issues) in this repo



