<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;


class TailorDashboardController extends Controller
{
    //
    public function tailorPanelView()
    {
        return Inertia::render('TailorDashboard/Dashboard');
    }
}
