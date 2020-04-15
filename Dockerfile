FROM rocker/r-ver:3.6.1

RUN apt update && apt install -y libv8-dev libcurl4-openssl-dev

RUN R -e 'install.packages( \
  c("V8", "odin", "deSolve", "jsonlite", "remotes"))'

RUN R -e 'library(remotes); install_github(c("mrc-ide/odin.js", \
"mrc-ide/squire@squire_js"))'

# Install node
RUN apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt install -y nodejs
