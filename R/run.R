library(squire)
library(jsonlite)
source('./R/reff.R')

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
        country = country,
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
      reff_pars <- c('prob_hosp', 'dur_ICase', 'dur_IMild')

      write_json(
        output$parameters[names(output$parameters) %in% c(user_pars, reff_pars)],
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


create_test_case <- function(iso3c) {
  
  country <- squire::population$country[squire::population$iso3c==iso3c][1]
  json <- NULL
  try({
    json_path <- file.path("https://raw.githubusercontent.com/mrc-ide/global-lmic-reports/master/",iso3c,"input_params.json")
    json <- jsonlite::read_json(json_path)
  })
  
  ## convert this into params for deterministic
  beta_to_R0 <- function(beta, dur_IMild, dur_ICase, prob_hosp, mixing_matrix) {
    squire:::adjusted_eigen(dur_IMild = dur_IMild, dur_ICase = dur_ICase,
                            prob_hosp = prob_hosp,
                            mixing_matrix =  mixing_matrix) * beta
  }
  
  contact_matrix = squire::get_mixing_matrix(country)
  population = squire::get_population(country)
  
  
  betas <- vapply(json, "[[", numeric(1), "beta_set")
  tt_R0 <- unlist(lapply(json, "[[", "tt_beta"))
  dates <- unlist(lapply(json, "[[", "date"))
 
  # get an initial with the same seeds as before
  population <- squire::get_population(country = country, simple_SEIR = FALSE)
  init <- squire:::init_check_explicit(NULL, population$n, seeding_cases = 5)
  init$S <- init$S + init$E1
  init$E1 <- c(0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0)
  init$S <- init$S - c(0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0)
  
  # run model
  det_out <- squire::run_deterministic_SEIR_model(
    country = country,
    beta_set = betas,
    walker_params = FALSE,
    init = init,
    day_return = TRUE,
    tt_R0 = tt_R0+1,
    R0 = tt_R0,
    time_period = 365)
  
  write_json(
    det_out$output,
    file.path(out_dir, paste0('output_',iso3c,'_fit.json')),
    pretty = TRUE,
    digits=NA
  )

    write_json(
    c(det_out$parameters[c("hosp_beds", "ICU_beds")],
      list("tt_beta" = tt_R0, "beta_set" = betas)),
    file.path(out_dir, paste0(iso3c,'_test_fit.json')),
    pretty = TRUE,
    digits=NA
  )


  
}

create_test_case("GBR")
