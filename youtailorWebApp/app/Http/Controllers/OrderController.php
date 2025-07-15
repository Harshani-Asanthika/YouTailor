<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Controller;

class OrderController extends Controller
{

    public function updateStatus(Request $request, Order $order)
    {
        // 1. Validate the incoming status
        $validated = $request->validate([
            'status' => 'required|string|in:Pending,Approved,Processing,Ready for Delivery,Completed,Cancelled',
            // Add any other validation rules if necessary
        ]);

        try {
            // 2. Update the order status
            $order->status = $validated['status'];
            $order->save();

            // Optional: Log the update
            Log::info("Order status updated: Order ID {$order->id}, New Status: {$order->status}");

            // 3. Return a success response or redirect
            // If using Inertia, you typically redirect back or render a new page
            return back()->with('success', 'Order status updated successfully!');

        } catch (\Exception $e) {
            // Handle any potential errors during save
            Log::error("Failed to update order status: " . $e->getMessage(), ['order_id' => $order->id, 'new_status' => $validated['status']]);
            return back()->withErrors(['status' => 'Failed to update order status. Please try again.']);
        }
    }

    
}
