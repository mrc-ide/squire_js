library(squire)
library(jsonlite)

args = commandArgs(trailingOnly=TRUE)
if (length(args) != 1) {
  stop("The only argument is the output directory")
}

countries <- get_countries()
populations <- lapply(unique(countries), function(c) get_population(c)$n)
names(populations) <- countries

processMatrix <- function(c) {
  m <- get_mixing_matrix(c)
  p <- get_population(c)$n
  m <- process_contact_matrix_scaled_age(m, p)
  mm <- t(t(m) / p)
  aperm(array(c(mm), dim = c(dim(mm), 1)), c(3, 1, 2))
}

matrices <- lapply(unique(population$country), processMatrix)
names(matrices) <- countries

prob_hosp <- c(0.000744192, 0.000634166,0.001171109, 0.002394593, 0.005346437,
   0.010289885, 0.016234604, 0.023349169, 0.028944623, 0.038607042,
   0.057734879, 0.072422135, 0.101602458, 0.116979814, 0.146099064,
   0.176634654 ,0.180000000)
dur_R <- 2.09
dur_hosp <- 5
processBeta <- function(c) {
  m <- get_mixing_matrix(c);
  p <- get_population(c)$n;
  m <- process_contact_matrix_scaled_age(m, p);
  beta_est_explicit(dur_R, dur_hosp, prob_hosp, m, 3)
}

betas <- lapply(unique(population$country), processBeta)
names(betas) <- countries

out_dir <- args[1]
write_json(populations, file.path(out_dir, 'population.json'), pretty=TRUE)
write_json(matrices, file.path(out_dir, 'matrices.json'), matrix='columnmajor', pretty=TRUE)
write_json(betas, file.path(out_dir, 'betas.json'), auto_unbox=TRUE)
