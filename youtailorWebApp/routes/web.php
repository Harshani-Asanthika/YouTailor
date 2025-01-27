<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\DressCustomizerController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', [HomeController::class, 'index'])->name('home.index');
Route::get('/dress-customizer', [DressCustomizerController::class, 'dressCustomizerView'])->name('home.dressCustomizer');
