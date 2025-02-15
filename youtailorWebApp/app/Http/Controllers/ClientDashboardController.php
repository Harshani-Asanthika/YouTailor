<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;


class ClientDashboardController extends Controller
{
    public function clientPanelView()
    {
        return Inertia::render('ClientDashboard/Dashboard');
    }
}



