<?php
// Simple URL router for clean URLs
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);
$path = trim($path, '/');

// Remove the base directory if running in a subdirectory
$basePath = '/uleziborafc';
if (strpos($path, 'uleziborafc/') === 0) {
    $path = substr($path, strlen('uleziborafc/'));
}

// Define route mappings
$routes = [
    '' => 'index.html',
    'home' => 'index.html',
    'about' => 'about.html',
    'programs' => 'service.html',
    'contact' => 'contact.html',
    'coaching-staff' => 'coachingstaff.html',
    'achievements' => 'achievements.html',
    'facilities' => 'facilities.html',
    'academy-life' => 'academy-life.html',
    'news' => 'news.html',
    'registration' => 'registration.html'
];

// Check if the route exists
if (array_key_exists($path, $routes)) {
    $file = $routes[$path];
    if (file_exists($file)) {
        include $file;
        exit;
    }
}

// If no route found, try to find the file with .html extension
$htmlFile = $path . '.html';
if (file_exists($htmlFile)) {
    include $htmlFile;
    exit;
}

// If still not found, show 404
http_response_code(404);
echo "<!DOCTYPE html>
<html>
<head>
    <title>Page Not Found - Ulezi Bora Academy</title>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <link href='css/bootstrap.min.css' rel='stylesheet'>
    <link href='css/style.css' rel='stylesheet'>
</head>
<body>
    <div class='container text-center py-5'>
        <h1 class='display-1 text-primary'>404</h1>
        <h2>Page Not Found</h2>
        <p class='lead'>The page you're looking for doesn't exist.</p>
        <a href='/' class='btn btn-primary'>Return Home</a>
    </div>
</body>
</html>";
?>