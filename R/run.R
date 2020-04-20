library(squire)
library(jsonlite)

args = commandArgs(trailingOnly=TRUE)
if (length(args) != 1) {
  stop("The output directory is required as an argument")
}
out_dir <- args[1]

# Set up test cases
countries <- c('St. Lucia', 'Nigeria', 'India')
beds <- c(100, 100000, 100000000)
R0s <- c(4, 3, 2, 1)

scenario <- 0

for (country in countries) {
  for (bed in beds) {
    for (R0 in R0s) {
      population <- squire::get_population(country)$n
      m <- squire::get_mixing_matrix(country)
      output <- run_deterministic_SEIR_model(
        population,
        m,
        c(0, 50),
        c(R0, R0/2),
        365,
        bed,
        bed
      )

      write_json(
        output$output,
        file.path(out_dir, paste0('output_', scenario, '.json')),
        pretty = TRUE,
        digits=NA
      )

      write_json(
        output$parameters,
        file.path(out_dir, paste0('pars_', scenario, '.json')),
        auto_unbox=TRUE,
        matrix='columnmajor',
        pretty=TRUE,
        digits=NA
      )
      scenario <- scenario + 1
    }
  }
}

