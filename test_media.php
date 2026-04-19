<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$review = App\Models\Review::has('media')->first();
if ($review) {
    echo json_encode($review->media->toArray(), JSON_PRETTY_PRINT);
} else {
    echo "No review with media found.";
}
