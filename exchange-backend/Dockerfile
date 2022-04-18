# syntax=docker/dockerfile:1
FROM ruby:2.7.5
RUN apt-get update -qq && apt-get install -y nodejs postgresql-client
WORKDIR /exchange

ENV BUILD_PACKAGES "build-essential libpq-dev cmake"
RUN apt-get update \
  && apt-get install -y --fix-missing --no-install-recommends $BUILD_PACKAGES; \
  rm -rf /var/lib/apt/lists/*

COPY Gemfile /exchange/Gemfile
COPY Gemfile.lock /myapp/Gemfile.lock
RUN gem install bundler
RUN bundle install

COPY . ./
