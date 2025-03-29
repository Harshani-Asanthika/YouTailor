<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\DesignController;
use App\Http\Controllers\ClientDashboardController;
use App\Http\Controllers\TailorDashboardController;
use App\Http\Middleware\EnsureClientIsAuthenticated;

use App\Http\Controllers\OrderController;


//Web site route
Route::get('/', [HomeController::class, 'index'])->name('home.index');

//Tailor routes
Route::get('tailor-panel/signup', [TailorDashboardController::class, 'tailorPanelSignup'])->name('tailor.tailorPanelSignup');
Route::post('tailor-panel/signup/process', [TailorDashboardController::class, 'tailorPanelSignupProcess'])->name('tailor.tailorPanelSignupProcess');
Route::get('tailor-panel/signin', [TailorDashboardController::class, 'tailorPanelSignin'])->name('tailor.tailorPanelSignin');
Route::post('tailor-panel/signin/process', [TailorDashboardController::class, 'signin_process']);
Route::get('tailor-panel/logout', [TailorDashboardController::class, 'logout']);




Route::group(['middleware' => 'AuthCheck'], function () {


    // Tailor Panel Routes
    Route::get('tailor-panel', [TailorDashboardController::class, 'tailorPanelView'])->name('tailor.tailorPanelView');

    // Tailor Panel Routes
    Route::get('tailor-panel/tailors', [TailorDashboardController::class, 'view']);
});

Route::get('client-panel/signup', [ClientDashboardController::class, 'clientPanelSignup']);
Route::get('client-panel/signin', [ClientDashboardController::class, 'clientPanelSignin']);
Route::post('client-panel/signup/process', [ClientDashboardController::class, 'clientPanelSignupProcess']);
Route::post('client-panel/signin/process', [ClientDashboardController::class, 'clientPanelSigninProcess']);
Route::group(['middleware' => 'EnsureClientIsAuthenticated'], function () { 
Route::get('client-panel/logout', [ClientDashboardController::class, 'clientlogout']);
Route::get('client-panel', [ClientDashboardController::class, 'clientPanelView'])->name('client.clientPanelView');

});

//Customize routes
Route::get('design', [DesignController::class, 'startDesign'])->name('design.startDesign');
Route::get('design/trouser', [DesignController::class, 'startDesignTrouser'])->name('design.startDesignTrouser');
Route::get('pick/dress', [DesignController::class, 'pickDress'])->name('design.pickDress');



Route::post('client/orders', [ClientDashboardController::class, 'placeOrder']);
Route::get('client/orders', [ClientDashboardController::class, 'getOrders']);
// routes/web.php or routes/api.php
Route::get('/storage/order-designs/{filename}', function ($filename) {
    return response()->file(storage_path('app/public/order-designs/' . $filename));
})->where('filename', '.*');