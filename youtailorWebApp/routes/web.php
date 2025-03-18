<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\TailorDashboardController;
use App\Http\Controllers\ClientDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



//Web site route
Route::get('/', [HomeController::class, 'index'])->name('home.index');

//Tailor routes
Route::get('tailor-panel/signup', [TailorDashboardController::class, 'tailorPanelSignup'])->name('tailor.tailorPanelSignup');
Route::post('tailor-panel/signup/process', [TailorDashboardController::class, 'tailorPanelSignupProcess'])->name('tailor.tailorPanelSignupProcess');
Route::get('tailor-panel/signin', [TailorDashboardController::class, 'tailorPanelSignin'])->name('tailor.tailorPanelSignin');
Route::post('tailor-panel/signin/process', [TailorDashboardController::class, 'signin_process']);
Route::get('tailor-panel/logout', [TailorDashboardController::class, 'logout']);


//Client routes
Route::get('client-panel', [ClientDashboardController::class, 'clientPanelView'])->name('client.clientPanelView');
Route::post('client-panel/signup/process', [ClientDashboardController::class, 'clientPanelSignupProcess']);
Route::post('client-panel/signin/process', [ClientDashboardController::class, 'clientPanelSigninProcess']);
Route::get('client-panel/logout', [ClientDashboardController::class, 'clientlogout']);


Route::group(['middleware' => 'AuthCheck'],function(){

   
    // Tailor Panel Routes
    Route::get('tailor-panel', [TailorDashboardController::class, 'tailorPanelView'])->name('tailor.tailorPanelView');
    
    // Tailor Panel Routes
    Route::get('tailor-panel/tailors', [TailorDashboardController::class, 'view']);
    

});