FROM rocker/r-ver:3.6.1

RUN apt update && apt install -y libv8-dev libcurl4-openssl-dev

RUN R -e 'install.packages( \
  c("V8", "odin", "deSolve", "jsonlite", "remotes"), \
  repos = "https://demo.rstudiopm.com/cran/__linux__/xenial/latest")'

RUN R -e 'library(remotes); install_github(c("mrc-ide/odin.js@mrc-1491", \
"mrc-ide/squire@js_model_package"))'

# Install node
RUN apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt install -y nodejs
