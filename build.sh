#!/bin/bash

if [ ! "$#" -eq 3 ]; then
  echo "model spec, interface and output path required, $# arguments provided"
  exit 1
fi

MODEL_SPEC=$1
INTERFACE_JS=$2
BUILD_JS=$3

# build the model code
R -e "odin.js::odin_js_bundle( \
  file.path(
    system.file('odin', package = 'squire', mustWork = TRUE),
    '$MODEL_SPEC'
  ), \
  '$BUILD_JS' \
)"

# add an interface
cat $INTERFACE_JS >> $BUILD_JS
