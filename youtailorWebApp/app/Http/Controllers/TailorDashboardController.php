<?php

namespace App\Http\Controllers;

use Exception;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Tailor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Models\TailorDetail;  // Add the model for your table

class TailorDashboardController extends Controller
{
  // In your controller
public function tailorPanelView()
{
    $orders = Order::with(['client' => function($query) {
            $query->select('client_id', 'fname', 'lname', 'mobile', 'address', 'username');
        }])
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($order) {
            return [
                'id' => $order->id,
                'cloth_name' => $order->cloth_name,
                'size' => $order->size,
                'quantity' => $order->quantity,
                'status' => $order->status,
                'instructions' => $order->instructions,
                'design_image' => $order->design_image 
                    ? asset(Storage::url($order->design_image))
                    : null,
                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
                'client' => $order->clientDetails ? [
                    'id' => $order->clientDetails->client_id,
                    'fname' => $order->clientDetails->fname,
                    'lname' => $order->clientDetails->lname,
                    'mobile' => $order->clientDetails->mobile,
                    'address' => $order->clientDetails->address,
                    'username' => $order->clientDetails->username,
                    'full_name' => $order->clientDetails->fname . ' ' . $order->clientDetails->lname,
                ] : null,
            ];
        });

    return Inertia::render('TailorDashboard/Dashboard', [
        'orders' => $orders,
        'user' => Auth::guard('tailor')->user(),
    ]);
}// Display Tailor Sign-Up Form
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

        // $tailor = Tailor::get();


        
      
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


    // public function view(){

    //     return Tailor::get();
    // }
}
