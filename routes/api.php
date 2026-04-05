<?php

use App\Http\Controllers\Api\SalesController;
use App\Http\Controllers\Api\CancelController;
use App\Http\Controllers\Api\CouponValidationController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // Registar venda
    Route::post('/sales', [SalesController::class, 'store']);

    // Cancelar comissão
    Route::post('/cancel', [CancelController::class, 'cancel']);

    // Validar cupão
    Route::get('/coupons/{code}', [CouponValidationController::class, 'validate']);

});