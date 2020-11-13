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
        population = population$n,
        contact_matrix_set = m,
        tt_R0 = c(0, 50),
        R0 = c(R0, R0/2),
        time_period = 365,
        hosp_bed_capacity = bed,
        ICU_bed_capacity = bed,
        day_return = TRUE, 
        init = init
        )

      write_json(
        output$output,
        file.path(out_dir, paste0('output_', scenario, '.json')),
        pretty = TRUE,
        digits=NA
        )

      # exact same pars as used to be exported by squire::run_deterministic_SEIR_model
     user_pars <- output$model$.__enclos_env__$private$user

      write_json(
        output$parameters[names(output$parameters) %in% user_pars],
        file.path(out_dir, paste0('pars_', scenario, '.json')),
        auto_unbox=TRUE,
        matrix='columnmajor',
        pretty=TRUE,
        digits=NA,
        force=TRUE
        )
      scenario <- scenario + 1
    }
  }
}
