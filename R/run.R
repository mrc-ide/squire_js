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
      pars_needed <- c(
        "N_age", 
        "S_0", 
        "E1_0",
        "E2_0",
        "IMild_0",
        "ICase1_0",
        "ICase2_0",
        "IOxGetLive1_0",
        "IOxGetLive2_0",
        "IOxGetDie1_0",
        "IOxGetDie2_0",
        "IOxNotGetLive1_0",
        "IOxNotGetLive2_0",
        "IOxNotGetDie1_0",
        "IOxNotGetDie2_0",
        "IMVGetLive1_0",
        "IMVGetLive2_0",
        "IMVGetDie1_0",
        "IMVGetDie2_0",
        "IMVNotGetLive1_0",
        "IMVNotGetLive2_0",
        "IMVNotGetDie1_0",
        "IMVNotGetDie2_0",
        "IRec1_0",
        "IRec2_0",
        "R_0",
        "D_0",
        "gamma_E",
        "gamma_R",
        "gamma_hosp",
        "gamma_get_ox_survive",
        "gamma_get_ox_die",
        "gamma_not_get_ox_survive",
        "gamma_not_get_ox_die",
        "gamma_get_mv_survive",
        "gamma_get_mv_die",
        "gamma_not_get_mv_survive",
        "gamma_not_get_mv_die",
        "gamma_rec",
        "prob_hosp",
        "prob_severe",
        "prob_non_severe_death_treatment",
        "prob_non_severe_death_no_treatment",
        "prob_severe_death_treatment",
        "prob_severe_death_no_treatment",
        "p_dist",
        "hosp_beds",
        "ICU_beds",
        "tt_matrix",
        "mix_mat_set",
        "tt_beta",
        "beta_set"
        )

      write_json(
        output$parameters[names(output$parameters) %in% pars_needed],
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
