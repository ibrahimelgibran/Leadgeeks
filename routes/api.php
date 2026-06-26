<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SubscriptionController;

Route::prefix('subscriptions')->group(function () {
    Route::get('/export', [SubscriptionController::class, 'export']);
    Route::get('/', [SubscriptionController::class, 'index']);
    Route::post('/', [SubscriptionController::class, 'store']);
    Route::get('/{subscription}', [SubscriptionController::class, 'show']);
    Route::put('/{subscription}', [SubscriptionController::class, 'update']);
    Route::delete('/{subscription}', [SubscriptionController::class, 'destroy']);
});
