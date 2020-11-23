library(squire)
library(jsonlite)
source('./R/reff.R')

args = commandArgs(trailingOnly=TRUE)
if (length(args) != 1) {
  stop("The output directory is required as an argument")
}

out_dir <- args[1]

country <- 'Brazil'
input_data <- './test/assets/BRA_inputs.json'

inputs <- read_json(input_data)
Rt <- vapply(inputs$input_params, function(i) i$Rt, numeric(1))
tt_beta  <- vapply(inputs$input_params, function(i) i$tt_beta, numeric(1))

# get an initial with the same seeds as before
population <- squire::get_population(country = country, simple_SEIR = FALSE)
init <- squire:::init_check_explicit(NULL, population$n, seeding_cases = 5)
init$S <- init$S + init$E1
init$E1 <- c(0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0)
init$S <- init$S - c(0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0)

# matrix for country
m <- squire::get_mixing_matrix(country)

# get the model run
output <- squire::run_deterministic_SEIR_model(
  country = country,
  tt_R0 = tt_beta,
  R0 = Rt,
  time_period = 365,
  hosp_bed_capacity = 100000,
  ICU_bed_capacity = 100000,
  day_return = TRUE, 
  init = init
)

write_json(
  output$output,
  file.path(out_dir, paste0('output_reff_squire.json')),
  pretty = TRUE,
  digits=NA
)

write_json(
  get_immunity_ratios(output, Rt, length(Rt)),
  file.path(out_dir, paste0('output_reff.json')),
  pretty = TRUE,
  digits=NA
)
