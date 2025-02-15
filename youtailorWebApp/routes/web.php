<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\DressCustomizerController;
use App\Http\Controllers\TailorDashboardController;
use App\Http\Controllers\ClientDashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home.index');
Route::get('/tailor-panel', [TailorDashboardController::class, 'tailorPanelView'])->name('tailor.tailorPanelView');
Route::get('/client-panel', [ClientDashboardController::class, 'clientPanelView'])->name('client.clientPanelView');