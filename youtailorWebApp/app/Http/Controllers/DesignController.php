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

    public function pickDress()
    {
        return Inertia::render('Customizer/DressPicker');
    }
    
    public function startDesignFrock()
    {
        return Inertia::render('Customizer/FrockCustomizer');
    }

        public function 
    designTrouserMale()
    {
        return Inertia::render('Customizer/TrouserCustomizer');
    }

      public function designPantFemale()
    {
        return Inertia::render('Customizer/TrouserCustomizerFemale');
    }

    public function pickCategory()
    {
        return Inertia::render('Customizer/PickGender');
    }
}
