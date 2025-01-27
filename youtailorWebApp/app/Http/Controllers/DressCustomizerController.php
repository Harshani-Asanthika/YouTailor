<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DressCustomizerController extends Controller
{
    //
    public function dressCustomizerView()
    {
        return Inertia::render('DressCustomizer');
    }
}
