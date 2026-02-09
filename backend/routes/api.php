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