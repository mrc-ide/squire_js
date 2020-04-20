source('R/probs.R')
library(squire)
library(jsonlite)

args = commandArgs(trailingOnly=TRUE)
if (length(args) != 1) {
  stop("The output directory is required as an argument")
}
out_dir <- args[1]

# Setting Up Model Parameters
population <- squire::get_population("Nigeria")
population <- population$n
m <- squire::get_mixing_matrix("Nigeria")
m <- squire:::process_contact_matrix_scaled_age(m, population)
dur_R <- 2.09
dur_hosp <- 5
beta <- squire::beta_est_explicit(dur_R, dur_hosp, prob_hosp, m, R0)
mm <- t(t(m) / population)
mix_mat_set <- aperm(array(c(mm), dim = c(dim(mm), 1)), c(3, 1, 2))

pars <- list(
  N_age = length(population),
  S_0 = population,
  E1_0 = rep(0, length(population)),
  E2_0 = rep(0, length(population)),
  IMild_0 = rep(1, length(population)),
  ICase1_0 = rep(1, length(population)),
  ICase2_0 = rep(1, length(population)),
  IOxGetLive1_0 = rep(0, length(population)),
  IOxGetLive2_0 = rep(0, length(population)),
  IOxGetDie1_0 = rep(0, length(population)),
  IOxGetDie2_0 = rep(0, length(population)),
  IOxNotGetLive1_0 = rep(0, length(population)),
  IOxNotGetLive2_0 = rep(0, length(population)),
  IOxNotGetDie1_0 = rep(0, length(population)),
  IOxNotGetDie2_0 = rep(0, length(population)),
  IMVGetLive1_0 = rep(0, length(population)),
  IMVGetLive2_0 = rep(0, length(population)),
  IMVGetDie1_0 = rep(0, length(population)),
  IMVGetDie2_0 = rep(0, length(population)),
  IMVNotGetLive1_0 = rep(0, length(population)),
  IMVNotGetLive2_0 = rep(0, length(population)),
  IMVNotGetDie1_0 = rep(0, length(population)),
  IMVNotGetDie2_0 = rep(0, length(population)),
  IRec1_0 = rep(0, length(population)),
  IRec2_0 = rep(0, length(population)),
  R_0 = rep(0, length(population)),
  D_0 = rep(0, length(population)),
  gamma_E = (2 * 1/4.58),
  gamma_R = (1/dur_R),
  gamma_hosp = (2 * 1/dur_hosp),
  gamma_get_ox_survive = (2 * 1/6),
  gamma_get_ox_die = (2 * 1/3.5),
  gamma_not_get_ox_survive = (2 * 1/9),
  gamma_not_get_ox_die = (0.5 * 2 * 1/9),
  gamma_get_mv_survive = (2 * 1/5.5),
  gamma_get_mv_die = (2 * 1/4),
  gamma_not_get_mv_survive = (2 * 1/12),
  gamma_not_get_mv_die = (2 * 1/1),
  gamma_rec = (2 * 1/6),
  prob_hosp = prob_hosp,
  prob_severe = prob_severe,
  prob_non_severe_death_treatment = prob_non_severe_death_treatment,
  prob_non_severe_death_no_treatment = prob_non_severe_death_no_treatment,
  prob_severe_death_treatment = prob_severe_death_treatment,
  prob_severe_death_no_treatment = prob_severe_death_no_treatment,
  p_dist = rep(1, length(population)),
  hosp_bed_capacity = 10000000000,
  ICU_bed_capacity = 10000000000,
  tt_matrix = c(0),
  mix_mat_set = mix_mat_set,
  tt_beta = c(0, 50, 200),
  beta_set = c(beta, beta/2, beta)
)

model_path <- file.path(
  system.file('odin', package = 'squire', mustWork = TRUE),
  "explicit_SEIR_deterministic.R"
)

x <- odin::odin(model_path)
mod <- x(user = pars, use_dde = TRUE)
t <- seq(from = 0, to = 249)
output <- mod$run(t)

write_json(
  output,
  file.path(out_dir, 'output.json'),
  pretty = TRUE,
  digits=NA
)
write_json(
  pars,
  file.path(out_dir, 'pars.json'),
  auto_unbox=TRUE,
  matrix='columnmajor',
  pretty=TRUE,
  digits=NA
)
