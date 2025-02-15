<?php

namespace App\Http\Controllers;

use App\Models\Tailor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TailorDetail;  // Add the model for your table
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class TailorDashboardController extends Controller
{
    // Display Tailor Dashboard View
    public function tailorPanelView()
    {
        return Inertia::render('TailorDashboard/Dashboard');
    }

    // Display Tailor Sign-Up Form
    public function tailorPanelSignup()
    {
        return Inertia::render('TailorDashboard/Signup');
    }

    // Handle Tailor Sign-Up Form Submission
    public function tailorPanelSignupProcess(Request $request)
    {
        // Validate the input fields
        // $validated = $request->validate([
        //     'firstName' => 'required|string|max:255',
        //     'lastName' => 'required|string|max:255',
        //     'email' => 'required|email|unique:tailor_details,email',
        //     'password' => 'required|string|min:6|confirmed',  // Ensure 'password_confirmation' field in the form
        // ]);

        $validator = Validator::make($request->all(),[
                 'firstName' => 'required|string|max:255',
           'lastName' => 'required|string|max:255',
          'email' => 'required|email|unique:tailor_details,email',
          'confirmPassword' => 'required',
            'password' => 'required|string|min:6|same:confirmPassword',  // Ensure 'password_confirmation' field in the form
        ]);

        if($validator->fails()){


            return response()->json([
                'success' => false,
                'message' => $validator->messages()->first()
            ]);
        }
        
        try{

            $tailor = Tailor::create([
                'fname' => $request->firstName,
                'lname' => $request->lastName,
                'email' => $request->email,
                'username' => $request->email,
                'password' => $request->password,  // Hash the password before saving
            ]);

            // $tailor =  new Tailor();

            // $tailor->fname = $request->firstName;
            // $tailor->lname = $request->lastName;
            // $tailor->email = $request->email;
            // $tailor->username = $request->email;
            // $tailor->password = $request->password; // Hash the password before saving

            // $tailor->save();

            return response()->json([
                'success' => true,
                'message' =>'Registeration successfully'
            ]);
    

        }catch(Exception $e){

            Log::error("Error occured while creating a new tailor : " . $e->getMessage());
            return response()->json([
                'success' => true,
                'message' =>'Server Error'
            ]);
        }

        $tailor = Tailor::get();


        
      
    }

    // Display Tailor Sign-In Form
    public function tailorPanelSignin()
    {
        return Inertia::render('TailorDashboard/Signin');
    }


    public function signin_process(request $request){

        $validator  = Validator::make($request->all(),[
            'username' => 'required',
            'password' => 'required'
        ]);


        if($validator->fails()){

            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ]);
        }


        if(Auth::guard('tailor')->attempt(['username' => $request->username,'password' => $request->password] )){



            return response()->json([
                'success' => true,
                'message' => 'Login successfully'
            ]);
        }else{

            return response()->json([
                'success' => false,
                'message' => 'incorrect Username or password'
            ]);
        }



    }



    public function logout(){


        Auth::guard('tailor')->logout();


        return redirect('/tailor-panel/signin');
    }


    public function view(){

        return Tailor::get();
    }
}
