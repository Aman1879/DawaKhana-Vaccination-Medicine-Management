<?php

return [
    'paths' => [resource_path('views')],
    'compiled' => env('VIEW_COMPILED_PATH', realpath(storage_path('framework/views'))),
    'relative_hash' => env('APP_RELATIVE_HASH', false),
    'charset' => 'UTF-8',
    'component_namespace' => null,
];
