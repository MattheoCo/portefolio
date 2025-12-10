# syntax=docker/dockerfile:1.6

FROM php:8.3-fpm-alpine AS base

# Install needed packages and PHP extensions
RUN apk add --no-cache bash git icu-dev oniguruma-dev libzip-dev zip tzdata \
    && docker-php-ext-configure intl \
    && docker-php-ext-install -j"$(nproc)" intl opcache \
    && rm -rf /var/cache/apk/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set workdir
WORKDIR /var/www/html

# Copy Symfony app (in dev we'll mount as a volume)
COPY --chown=www-data:www-data . /var/www/html

# PHP-FPM port
EXPOSE 9000

CMD ["php-fpm"]
