<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Tailor; // Assuming this is your Tailor model
use App\Models\Client; // Correctly imported Client model
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Controller; // Correct Inertia Controller import
use Inertia\Inertia;

class TailorDashboardController extends Controller
{
    /**
     * Display the Tailor Dashboard View.
     */
    public function tailorPanelView()
    {
        $orders = Order::with(['client' => function($query) {
            // Select 'client_id' (which is the primary key for Client model)
            // and other necessary columns from the 'client_details' table.
            $query->select('client_id', 'fname', 'lname', 'mobile', 'address', 'username');
        }])
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($order) {
            // Ensure the relationship name in Order model matches 'client'
            // Access client_id as primary key
            $clientData = $order->client ? [
                'id' => $order->client->client_id, // Access client_id as per Client model's primaryKey
                'fname' => $order->client->fname,
                'lname' => $order->client->lname,
                'mobile' => $order->client->mobile,
                'address' => $order->client->address,
                'username' => $order->client->username,
                'full_name' => $order->client->fname . ' ' . $order->client->lname,
            ] : null;

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
                'client' => $clientData,
            ];
        });

        return Inertia::render('TailorDashboard/Dashboard', [
            'orders' => $orders,
            'user' => Auth::guard('tailor')->user(), // Using the 'tailor' guard
        ]);
    }

    /**
     * Display Tailor Sign-Up Form.
     */
    public function tailorPanelSignup()
    {
        return Inertia::render('TailorDashboard/Signup');
    }

    /**
     * Handle Tailor Sign-Up Form Submission.
     */
    public function tailorPanelSignupProcess(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            // Rule::unique should point to the actual table where tailors are stored
            'email' => 'required|email|unique:tailors,email', // Assuming 'tailors' is the table
            'confirmPassword' => 'required',
            'password' => 'required|string|min:6|same:confirmPassword',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->messages()->first()
            ]);
        }

        try {
            $validator = Tailor::create([
                'fname' => $request->firstName,
                'lname' => $request->lastName,
                'email' => $request->email,
                'username' => $request->email,
                'password' => Hash::make($request->password), // Always hash passwords
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Registration successful!'
            ]);

        } catch (Exception $e) {
            Log::error("Error occurred while creating a new tailor: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Server Error during registration.'
            ]);
        }
    }

    /**
     * Display Tailor Sign-In Form.
     */
    public function tailorPanelSignin()
    {
        return Inertia::render('TailorDashboard/Signin');
    }

    /**
     * Handle Tailor Sign-In Process.
     */
    public function signin_process(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ]);
        }

        if (Auth::guard('tailor')->attempt(['username' => $request->username, 'password' => $request->password])) {
            return response()->json([
                'success' => true,
                'message' => 'Login successful!',
                'redirect' => '/tailor-panel' // Redirect for Inertia
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Incorrect username or password.'
            ]);
        }
    }

    /**
     * Update the Tailor's Profile Information.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
  
   
    public function logout(Request $request)
    {
        Auth::guard('tailor')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/tailor-panel/signin');
    }
}