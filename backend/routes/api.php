<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\ExportTransactionController;
use App\Http\Controllers\ImportTransactionController;
use App\Http\Controllers\UserController;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    require __DIR__ . '/auth.php';
});

Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::get('/user', function (Request $request) {
        return new UserResource($request->user());
    });

    Route::apiResource('import-transactions', ImportTransactionController::class)->only(['index', 'store']);
    Route::apiResource('export-transactions', ExportTransactionController::class)->only(['index', 'store']);
    Route::get('/clients', [ClientController::class, 'index']);

    // Admin-only: User management
    Route::apiResource('users', UserController::class);
});