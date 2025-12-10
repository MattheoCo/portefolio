# syntax=docker/dockerfile:1.6

FROM php:8.3-fpm-alpine AS php-base

RUN apk add --no-cache git icu-dev oniguruma-dev libzip-dev zip tzdata \
    && docker-php-ext-configure intl \
    && docker-php-ext-install -j"$(nproc)" intl opcache \
    && rm -rf /var/cache/apk/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

ENV COMPOSER_ALLOW_SUPERUSER=1

COPY . /var/www/html

RUN composer install --no-dev --no-scripts --prefer-dist --no-progress --no-interaction \
    && mkdir -p var \
    && chown -R www-data:www-data /var/www/html


FROM alpine:3.20

RUN apk add --no-cache nginx supervisor bash tzdata

# Copy PHP-FPM from previous stage
COPY --from=php-base /usr/local/bin/ /usr/local/bin/
COPY --from=php-base /usr/local/sbin/ /usr/local/sbin/
COPY --from=php-base /usr/local/etc/php/ /usr/local/etc/php/
COPY --from=php-base /usr/local/etc/php-fpm.conf /usr/local/etc/php-fpm.conf
COPY --from=php-base /usr/local/etc/php-fpm.d/ /usr/local/etc/php-fpm.d/
COPY --from=php-base /var/www/html /var/www/html

# Nginx config
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Supervisor config to run both services
COPY docker/supervisord.conf /etc/supervisord.conf

# Nginx expects this directory
RUN mkdir -p /run/nginx \
    && (id -u www-data >/dev/null 2>&1 || adduser -D -H -s /sbin/nologin www-data) \
    && chown -R www-data:www-data /var/www/html

ENV APP_ENV=prod \
    APP_DEBUG=0

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
