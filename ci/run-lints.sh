#!/usr/bin/env bash

result=0
trap 'result=1' ERR
tslint -p tsconfig.json -c tslint.json '{src,test}/**/*.{ts,tsx}' --fix
sass-lint -c .sasslintrc.json -v -q --max-warnings 0
tsc --noEmit -p tsconfig.json
exit ${result}
