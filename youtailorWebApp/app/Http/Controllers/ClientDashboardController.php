<?php

namespace App\Http\Controllers;

use Exception;
use Inertia\Inertia;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ClientDashboardController extends Controller
{
    /**
     * Show the client panel dashboard.
     */
    public function clientPanelView()
    {
        // Get the authenticated client
        $client = Auth::guard('client')->user();

        // Pass the client's name (or full data) to the Inertia view
        return Inertia::render('ClientDashboard/Dashboard', [
            'client' => [
                'name' => $client->first_name . ' ' . $client->last_name, // Concatenate first and last name
                'email' => $client->email,
                'mobile' => $client->mobile,
            ],
        ]);
    }

    public function clientPanelSignup(){
        return Inertia::render('ClientDashboard/Signup');
    }
    public function clientPanelSignin(){
        return Inertia::render('ClientDashboard/Signin');
    }

    /**
     * Handle client sign-up process.
     */
    public function clientPanelSignupProcess(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email',
            'mobile' => 'required|digits:10|unique:clients,mobile',
            'confirmPassword' => 'required',
            'password' => 'required|string|min:6|same:confirmPassword',
        ]);

        // If validation fails, return errors
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Store user details in the database
        try {
            $client = Client::create([
                'first_name' => $request->firstName,
                'username' => $request->email,
                'last_name' => $request->lastName,
                'email' => $request->email,
                'mobile' => $request->mobile,
                'password' => Hash::make($request->password),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Registration successful!'
            ], 201);
        } catch (Exception $e) {
            Log::error("Error occurred while creating a new client: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong. Please try again later.'
            ], 500);
        }
    }

    /**
     * Handle client sign-in process.
     */
    public function clientPanelSigninProcess(Request $request)
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

        try {
            if (Auth::guard('client')->attempt(['username' => $request->username, 'password' => $request->password])) {
                return response()->json([
                    'success' => true,
                    'message' => 'Login successfully',
                    'redirect' => url('/client-panel')
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Incorrect username or password'
                ]);
            }
        } catch (Exception $e) {
            Log::error("Error occurred while signing in client: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Server Error'
            ]);
        }
    }

    /**
     * Handle client logout.
     */
    public function clientlogout()
    {
        Auth::guard('client')->logout();
        return redirect('/');
    }
}