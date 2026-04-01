<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Owner\CompanyController;
use App\Http\Middleware\EnsureOwner;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\AffiliateController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Middleware\EnsureAdmin;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';

// ─── Owner ───────────────────────────────────────────────────────────────────
Route::middleware(['auth', EnsureOwner::class])
    ->prefix('owner')
    ->name('owner.')
    ->group(function () {

        Route::get('/companies', [CompanyController::class, 'index'])->name('companies.index');
        Route::get('/companies/create', [CompanyController::class, 'create'])->name('companies.create');
        Route::post('/companies', [CompanyController::class, 'store'])->name('companies.store');
        Route::get('/companies/{company}', [CompanyController::class, 'show'])->name('companies.show');
        Route::get('/companies/{company}/edit', [CompanyController::class, 'edit'])->name('companies.edit');
        Route::put('/companies/{company}', [CompanyController::class, 'update'])->name('companies.update');
        Route::delete('/companies/{company}', [CompanyController::class, 'destroy'])->name('companies.destroy');
        Route::patch('/companies/{company}/toggle-active', [CompanyController::class, 'toggleActive'])->name('companies.toggleActive');
        Route::get('/companies/{company}/swap-admin', [CompanyController::class, 'swapAdmin'])->name('companies.swapAdmin.form');
        Route::post('/companies/{company}/swap-admin', [CompanyController::class, 'swapAdmin'])->name('companies.swapAdmin');
        Route::post('/companies/{company}/regenerate-api-key', [CompanyController::class, 'regenerateApiKey'])->name('companies.regenerateApiKey');

    });

// ─── Admin ───────────────────────────────────────────────────────────────────
Route::middleware(['auth', EnsureAdmin::class])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // Dashboard
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // Configurações
        Route::get('/settings', [SettingsController::class, 'index'])->name('settings');

        // Afiliados
        Route::get('/affiliates', [AffiliateController::class, 'index'])->name('affiliates.index');
        Route::get('/affiliates/create', [AffiliateController::class, 'create'])->name('affiliates.create');
        Route::post('/affiliates', [AffiliateController::class, 'store'])->name('affiliates.store');
        Route::get('/affiliates/{affiliate}/edit', [AffiliateController::class, 'edit'])->name('affiliates.edit');
        Route::put('/affiliates/{affiliate}', [AffiliateController::class, 'update'])->name('affiliates.update');
        Route::patch('/affiliates/{affiliate}/toggle-active', [AffiliateController::class, 'toggleActive'])->name('affiliates.toggleActive');
        Route::delete('/affiliates/{affiliate}', [AffiliateController::class, 'destroy'])->name('affiliates.destroy');

        // Cupões
        Route::get('/coupons', [CouponController::class, 'index'])->name('coupons.index');
        Route::get('/coupons/create', [CouponController::class, 'create'])->name('coupons.create');
        Route::post('/coupons', [CouponController::class, 'store'])->name('coupons.store');
        Route::get('/coupons/{coupon}/edit', [CouponController::class, 'edit'])->name('coupons.edit');
        Route::put('/coupons/{coupon}', [CouponController::class, 'update'])->name('coupons.update');
        Route::patch('/coupons/{coupon}/toggle-active', [CouponController::class, 'toggleActive'])->name('coupons.toggleActive');
        Route::delete('/coupons/{coupon}', [CouponController::class, 'destroy'])->name('coupons.destroy');

        // Produtos
        Route::get('/products', [ProductController::class, 'index'])->name('products.index');
        Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
        Route::post('/products', [ProductController::class, 'store'])->name('products.store');
        Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
        Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
        Route::patch('/products/{product}/toggle-active', [ProductController::class, 'toggleActive'])->name('products.toggleActive');
        Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    });