<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Sentry\Laravel\Integration;

$app = Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);

        $middleware->alias([
            'role' => \App\Http\Middleware\EnsureRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        Integration::handles($exceptions);
    })->create();

// On shared hosting without a configurable document root, this app's
// public/ contents get moved into a sibling public_html/ folder (see
// DEPLOYMENT.md "Opsi B"). When that's the case, Laravel's default
// public_path() (base_path('public')) no longer matches where the compiled
// Vite assets actually live, so @vite() can't find build/manifest.json.
// Self-detect and repoint public_path() instead of requiring per-host env
// config - normal single-root deployments are unaffected since their
// default public/build already exists and this check is skipped.
if (! is_dir($app->basePath('public/build')) && is_dir($app->basePath('../public_html'))) {
    $app->usePublicPath($app->basePath('../public_html'));
}

return $app;
