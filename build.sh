#!/bin/bash

if [ ! "$#" -eq 2 ]; then
  echo "model spec and output path required, $# arguments provided"
  exit 1
fi

MODEL_SPEC=$1
BUILD_JS=$2

# build the model code
R -e "odin.js::odin_js_bundle( \
  file.path(
    system.file('odin', package = 'squire', mustWork = TRUE),
    '$MODEL_SPEC'
  ), \
  '$BUILD_JS' \
)"
