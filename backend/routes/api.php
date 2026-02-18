<?php

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    require __DIR__ . '/auth.php';
});

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/hello', function () {
    return response()->json([
        'message' => 'Hello, World!',
        'status' => 'success',
        'my_name' => 'Sean'
    ]);
});


Route::get('/users', function () {
    return UserResource::collection(User::all());
});

// Admin-only user management routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('users')->group(function () {
    Route::get('/', [\App\Http\Controllers\UserController::class, 'index']);
    Route::post('/', [\App\Http\Controllers\UserController::class, 'store']);
    Route::get('/{id}', [\App\Http\Controllers\UserController::class, 'show']);
    Route::put('/{id}', [\App\Http\Controllers\UserController::class, 'update']);
    Route::post('/{id}/deactivate', [\App\Http\Controllers\UserController::class, 'deactivate']);
    Route::post('/{id}/activate', [\App\Http\Controllers\UserController::class, 'activate']);
});

// Admin-only client management routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('clients')->group(function () {
    Route::get('/', [\App\Http\Controllers\ClientController::class, 'index']);
    Route::post('/', [\App\Http\Controllers\ClientController::class, 'store']);
    Route::get('/{id}', [\App\Http\Controllers\ClientController::class, 'show']);
    Route::put('/{id}', [\App\Http\Controllers\ClientController::class, 'update']);
    Route::post('/{id}/toggle-active', [\App\Http\Controllers\ClientController::class, 'toggleActive']);
    Route::get('/{id}/transactions', [\App\Http\Controllers\ClientController::class, 'transactions']);
});

// Admin-only transaction oversight routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('transactions')->group(function () {
    Route::get('/', [\App\Http\Controllers\TransactionController::class, 'index']);
    Route::get('/encoders', [\App\Http\Controllers\TransactionController::class, 'encoders']);
    Route::patch('/imports/{id}/assign', [\App\Http\Controllers\TransactionController::class, 'reassignImport']);
    Route::patch('/exports/{id}/assign', [\App\Http\Controllers\TransactionController::class, 'reassignExport']);
    Route::patch('/imports/{id}/status', [\App\Http\Controllers\TransactionController::class, 'overrideImportStatus']);
    Route::patch('/exports/{id}/status', [\App\Http\Controllers\TransactionController::class, 'overrideExportStatus']);
});

// Admin-only reports & analytics routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('reports')->group(function () {
    Route::get('/monthly', [\App\Http\Controllers\ReportController::class, 'monthly']);
    Route::get('/clients', [\App\Http\Controllers\ReportController::class, 'clients']);
    Route::get('/turnaround', [\App\Http\Controllers\ReportController::class, 'turnaround']);
});

// Admin-only audit log routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('audit-logs')->group(function () {
    Route::get('/', [\App\Http\Controllers\AuditLogController::class, 'index']);
    Route::get('/actions', [\App\Http\Controllers\AuditLogController::class, 'actions']);
});