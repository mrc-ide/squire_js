get_immunity_ratios <- function(out, Rt, t_now) {

  # mixing_matrix is already the mixing matrix that we pass to you in the country json files
  mixing_matrix <- squire:::process_contact_matrix_scaled_age(
    out$parameters$contact_matrix_set[[1]],
    out$parameters$population
  )

  # these parameters are found in pars_0.json that is imported in index.js
  dur_ICase <- out$parameters$dur_ICase
  dur_IMild <- out$parameters$dur_IMild
  prob_hosp <- out$parameters$prob_hosp

  #
  index <- squire:::odin_index(out$model)

  # pop is a 17 length with population sizes in each age category
  pop <- out$parameters$population

  # in here we work out each time point the number of idnividuals in each age category in
  # the S compartment and then divide by the total population size in each age category
  # to give the proportion susceptible at each time point
  prop_susc <- t(t(out$output[, index$S,])/pop)

  # Length 17 with relative R0 in each age category
  relative_R0_by_age <- prob_hosp*dur_ICase + (1-prob_hosp)*dur_IMild

  # here we are looping over each time point to calculate the adjusted eigen
  # incorporating the proportion of the suscpetible population in each age group
  adjusted_eigens <- vapply(
    seq(t_now),
    function(t) {
      Re(eigen(mixing_matrix * prop_susc[t,] * relative_R0_by_age)$values[1])
    },
    numeric(1)
  )

  # multiply beta by the adjusted eigen at each time point and devide by the
  # original R0
  ratios <- (out$parameters$beta_set * adjusted_eigens) / out$parameters$R0

  # multiply our time varying Rt by the ratios at each time point to get Reff
  Reff <- Rt * ratios

  return(Reff)
}
