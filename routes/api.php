<?php

use App\Http\Controllers\Api\SalesController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // Endpoint de receção de vendas
    Route::post('/sales', [SalesController::class, 'store']);

});