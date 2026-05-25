<?php
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Respond to preflight requests immediately
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    http_response_code(204);
    exit;
}

// Simple root JSON
if ($path === '/' || $path === '') {
    header('Content-Type: application/json');
    echo json_encode([
        'message' => 'Smart Vaccine & Ointment Management System API',
        'status' => 'running',
    ]);
    return true;
}

// No demo fallback here anymore; let Laravel handle auth so we use real DB-backed login.

// Let the built-in server serve static files if present
$file = __DIR__ . '/public' . $path;
if ($path !== '/' && file_exists($file)) {
    return false;
}

// Fallback to Laravel front controller
require __DIR__ . '/public/index.php';
