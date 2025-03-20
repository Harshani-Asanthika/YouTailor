<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DesignController extends Controller
{
    //
    public function startDesign()
    {
        return Inertia::render('Customizer/DressCustomizer');
    }
}
