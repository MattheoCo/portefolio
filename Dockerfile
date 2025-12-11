# syntax=docker/dockerfile:1.6

FROM php:8.3-fpm-alpine

RUN apk add --no-cache git icu-dev oniguruma-dev libzip-dev zip tzdata \
    && docker-php-ext-configure intl \
    && docker-php-ext-install -j"$(nproc)" intl opcache \
    && rm -rf /var/cache/apk/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

ENV COMPOSER_ALLOW_SUPERUSER=1 \
    APP_ENV=prod \
    APP_DEBUG=0 \
    APP_SECRET=33f7506276c6fb53c71d262464501e31

# Copy app and install deps (skip scripts during build)
COPY . /var/www/html
RUN composer install --no-dev --no-scripts --prefer-dist --no-progress --no-interaction \
    && mkdir -p var

# Install Nginx + Supervisor
RUN apk add --no-cache nginx supervisor bash tzdata \
    && mkdir -p /run/nginx

# Nginx config
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Supervisor config to run both services
COPY docker/supervisord.conf /etc/supervisord.conf

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=3s --retries=5 CMD wget -qO- http://127.0.0.1/ || exit 1

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
