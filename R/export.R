source('R/probs.R')
library(squire)
library(jsonlite)

args = commandArgs(trailingOnly=TRUE)
if (length(args) != 1) {
  stop("The only argument is the output directory")
}

countries <- get_lmic_countries()
populations <- lapply(countries, function(c) get_population(c)$n)
names(populations) <- countries

processMatrix <- function(c) {
  m <- get_mixing_matrix(c)
  p <- get_population(c)$n
  m <- process_contact_matrix_scaled_age(m, p)
  mm <- t(t(m) / p)
  aperm(array(c(mm), dim = c(dim(mm), 1)), c(3, 1, 2))
}

matrices <- lapply(countries, processMatrix)
names(matrices) <- countries

dur_R <- 2.09
dur_hosp <- 5
processBeta <- function(c) {
  m <- get_mixing_matrix(c)
  p <- get_population(c)$n
  m <- process_contact_matrix_scaled_age(m, p)
  beta_est_explicit(dur_R, dur_hosp, prob_hosp, m, R0)
}

betas <- lapply(countries, processBeta)
names(betas) <- countries

out_dir <- args[1]
write_json(populations, file.path(out_dir, 'population.json'), pretty=TRUE, digits=NA)
write_json(matrices, file.path(out_dir, 'matrices.json'), matrix='columnmajor', pretty=TRUE, digits=NA)
write_json(betas, file.path(out_dir, 'betas.json'), auto_unbox=TRUE, digits=NA)
