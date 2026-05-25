FROM php:8.2-cli

WORKDIR /app

RUN apt-get update && apt-get install -y \
    unzip \
    git \
    curl \
    libzip-dev \
    zip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    default-mysql-client \
    && docker-php-ext-install zip pdo pdo_mysql bcmath gd xml

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . .

RUN mkdir -p bootstrap/cache storage/framework/cache storage/framework/sessions storage/framework/views storage/logs \
    && chown -R www-data:www-data bootstrap/cache storage \
    && chmod -R ug+rwx bootstrap/cache storage

RUN composer install --no-dev --optimize-autoloader --no-plugins --no-scripts || composer install --no-dev --optimize-autoloader

EXPOSE 10000

CMD sh -c 'php artisan serve --host=0.0.0.0 --port=${PORT:-10000}'