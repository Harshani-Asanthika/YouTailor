<?php

namespace App\Http\Controllers;

use Exception;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ClientDashboardController extends Controller
{
    /**
     * Show the client panel dashboard.
     */
    public function clientPanelView()
    {
        $client = Auth::guard('client')->user();

        if (!$client) {
            return redirect('/client/signin');
        }

        return Inertia::render('ClientDashboard/Dashboard', [
            'client' => [
                'id' => $client->client_id,
                'name' => $client->fname . ' ' . $client->lname,
                'firstName' => $client->fname,
                'lastName' => $client->lname,
                'email' => $client->email,
                'username' => $client->username,
            ]
        ]);
    }

    public function clientPanelSignup()
    {
        return Inertia::render('ClientDashboard/Signup');
    }

    public function clientPanelSignin()
    {
        return Inertia::render('ClientDashboard/Signin');
    }

    /**
     * Handle client sign-up process.
     */
    public function clientPanelSignupProcess(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'mobile' => 'required|string|max:10',
            'address' => 'required|string|max:255',
            'email' => 'required|email|unique:client_details,email',
            'confirmPassword' => 'required',
            'password' => 'required|string|min:6|same:confirmPassword',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ]);
        }

        try {
            $client = new Client();
            $client->fname = $request->firstName;
            $client->lname = $request->lastName;
            $client->mobile = $request->mobile;
            $client->address = $request->address;
            $client->email = $request->email;
            $client->username = $request->email;
            $client->password = Hash::make($request->password);
            $client->save();

            return response()->json([
                'success' => true,
                'message' => 'Registration successful! Please sign in.',
                'redirect' => '/client/signin'
            ]);
        } catch (Exception $e) {
            Log::error("Registration error: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Registration failed. Please try again.'
            ]);
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

        // Find user by email or username
        $client = Client::where('email', $request->username)
            ->orWhere('username', $request->username)
            ->first();

        if (!$client) {
            Log::debug('Login failed: User not found', ['username' => $request->username]);
            return response()->json([
                'success' => false,
                'message' => 'Account not found'
            ]);
        }

        // Manual password verification
        if (!Hash::check($request->password, $client->password)) {
            Log::debug('Login failed: Password mismatch', ['client_id' => $client->client_id]);
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ]);
        }

        // Manual login
        Auth::guard('client')->login($client);

        Log::debug('Login successful', ['client_id' => $client->client_id]);
        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'redirect' => '/client/dashboard'
        ]);
    }

    /**
     * Handle client logout.
     */
    public function clientlogout()
    {
        Auth::guard('client')->logout();
        return redirect('/client/signin');
    }

    /**
     * TEST ROUTE - Remove in production
     */
    public function testAuth()
    {
        return response()->json([
            'authenticated' => Auth::guard('client')->check(),
            'user' => Auth::guard('client')->user()
        ]);
    }

    public function placeOrder(Request $request)
    {
        $client = Auth::guard('client')->user();
    
        if (!$client) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required'
            ], 401);
        }
    
        $validator = Validator::make($request->all(), [
            'clothName' => 'required|string|max:255',
            'size' => 'required|string|max:50',
            'quantity' => 'required|integer|min:1',
            'mobile' => 'required|string|max:15',
            'address' => 'required|string|max:500',
            'instructions' => 'nullable|string|max:1000',
            'designImage' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ], 422);
        }
    
        try {
            $order = new Order();
            $order->client_id = $client->client_id;
            $order->cloth_name = $request->clothName;
            $order->size = $request->size;
            $order->quantity = $request->quantity;
            $order->mobile = $request->mobile;
            $order->address = $request->address;
            $order->instructions = $request->instructions;
            $order->status = 'Pending';
    
            // Handle file upload if present
            if ($request->hasFile('designImage')) {
                $path = $request->file('designImage')->store('order-designs', 'public');
                $order->design_image = $path; // Store relative path
            }
    
            $order->save();
    
            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully!',
                'order' => [
                    ...$order->toArray(),
                    'designImage' => $order->design_image 
                        ? asset(Storage::url($order->design_image))
                        : null
                ]
            ]);
        } catch (Exception $e) {
            Log::error("Order placement error: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to place order. Please try again.'
            ], 500);
        }
    }

    public function getOrders()
    {
        $client = Auth::guard('client')->user();

        if (!$client) {
            return response()->json([
                'status' => false,  
                'message' => 'Authentication required'
            ]);
        }

        $orders = Order::where('client_id', $client->client_id)
            ->orderBy('created_at', 'desc')
            ->get();


        return response()->json([
            'status' => true,
            'data' => $orders
        ]);
    }
}
