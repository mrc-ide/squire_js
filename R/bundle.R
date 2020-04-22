args = commandArgs(trailingOnly=TRUE)
if (length(args) != 2) {
  stop("This script requires the model spec and the output path")
}
odin.js::odin_js_bundle(
  file.path(
    system.file('odin', package = 'squire', mustWork = TRUE),
    args[1]
  ),
  args[2]
)
