<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TennisSlotController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/slots', [TennisSlotController::class, 'index']);
    Route::get('/slots/{slot}', [TennisSlotController::class, 'show']);

    Route::middleware('can:manage-slots')->group(function () {
        Route::post('/slots', [TennisSlotController::class, 'store']);
        Route::delete('/slots/{slot}', [TennisSlotController::class, 'destroy']);
        Route::patch('/slots/{slot}/release', [TennisSlotController::class, 'release']);
    });

    Route::post('/slots/{slot}/book', [TennisSlotController::class, 'book']);
});

Route::get('/slots/public', [TennisSlotController::class, 'publicIndex']);
