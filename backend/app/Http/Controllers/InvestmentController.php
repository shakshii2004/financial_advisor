<?php

namespace App\Http\Controllers;

use App\Models\Investment;
use App\Models\Startup;
use App\Models\User;
use Illuminate\Http\Request;

class InvestmentController extends Controller
{
    // For Founders: See who has invested in their startup
    public function getInvestors(Request $request)
    {
        $request->validate([
            'startup_id' => 'required|exists:startups,id',
        ]);

        $startup = Startup::findOrFail($request->startup_id);

        if ($startup->user_id !== auth()->id() && auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $startup->investors
        ]);
    }

    // For Investors: See which startups they've invested in
    public function getPortfolio()
    {
        $user = auth()->user();

        if ($user->role !== 'investor' && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Must be an investor.'], 403);
        }

        // Return startups the user has invested in
        $startups = $user->investedStartups()->with('user')->get();

        return response()->json([
            'success' => true,
            'data' => $startups
        ]);
    }

    // Mock endpoint: Grant an investor access to a startup
    public function addInvestment(Request $request)
    {
        $request->validate([
            'startup_id' => 'required|exists:startups,id',
            'investor_email' => 'required|email|exists:users,email',
            'amount' => 'nullable|numeric',
            'equity_percentage' => 'nullable|numeric'
        ]);

        $startup = Startup::findOrFail($request->startup_id);

        // Only the founder can add an investor
        if ($startup->user_id !== auth()->id() && auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $investor = User::where('email', $request->investor_email)->first();

        // Ensure the target user is actually an investor
        if ($investor->role !== 'investor') {
            return response()->json(['message' => 'The target user is not registered as an investor.'], 400);
        }

        // Create or update the investment record
        $investment = Investment::updateOrCreate(
            ['startup_id' => $startup->id, 'investor_id' => $investor->id],
            [
                'amount' => $request->amount ?? 0,
                'equity_percentage' => $request->equity_percentage ?? 0,
                'status' => 'active'
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Investor successfully added to startup.',
            'data' => $investment
        ]);
    }

    // For Investors: Browse the Startup Marketplace (Discovery)
    public function getDiscovery()
    {
        $user = auth()->user();

        if ($user->role !== 'investor' && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Must be an investor.'], 403);
        }

        // Return startups that have active funding requests, or all active startups
        $startups = Startup::with(['fundingRequests' => function ($query) {
            $query->where('status', 'active');
        }])->get()->map(function ($startup) {
            $activeRequest = $startup->fundingRequests->first();
            $raised = \App\Models\Investment::where('startup_id', $startup->id)->sum('amount');
            
            $progress = 0;
            if ($activeRequest && $activeRequest->target_amount > 0) {
                $progress = ($raised / $activeRequest->target_amount) * 100;
            }

            $startup->funding_progress = round(min(100, $progress), 1);
            $startup->raised_amount = $raised;
            return $startup;
        });

        return response()->json([
            'success' => true,
            'data' => $startups
        ]);
    }

    // For Investors: Express interest in a startup / funding request
    public function expressInterest(Request $request)
    {
        $user = auth()->user();

        if ($user->role !== 'investor') {
            return response()->json(['message' => 'Unauthorized. Must be an investor.'], 403);
        }

        $request->validate([
            'startup_id' => 'required|exists:startups,id',
            'funding_request_id' => 'nullable|exists:funding_requests,id',
            'message' => 'nullable|string'
        ]);

        $interest = \App\Models\InvestorInterest::updateOrCreate(
            [
                'user_id' => $user->id,
                'startup_id' => $request->startup_id,
                'funding_request_id' => $request->funding_request_id
            ],
            [
                'status' => 'interested',
                'message' => $request->message
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Interest recorded successfully.',
            'data' => $interest
        ]);
    }

    // For Investors: Get their pipeline of interests
    public function getInterests()
    {
        $user = auth()->user();

        if ($user->role !== 'investor') {
            return response()->json(['message' => 'Unauthorized. Must be an investor.'], 403);
        }

        $interests = \App\Models\InvestorInterest::with(['startup', 'fundingRequest'])
            ->where('user_id', $user->id)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $interests
        ]);
    }

    // For Founders: Get all interests expressed in their startups
    public function getStartupInterests()
    {
        $user = auth()->user();
        
        if ($user->role !== 'founder' && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $startupIds = $user->startups()->pluck('id');
        
        $interests = \App\Models\InvestorInterest::with(['startup', 'user'])
            ->whereIn('startup_id', $startupIds)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $interests
        ]);
    }

    // For Founders/Investors: Update the status of a deal pipeline item
    public function updateInterestStatus(Request $request)
    {
        $request->validate([
            'interest_id' => 'required|exists:investor_interests,id',
            'status' => 'required|in:interested,discovery,funding,closed,declined'
        ]);

        $interest = \App\Models\InvestorInterest::findOrFail($request->interest_id);
        $startup = $interest->startup;

        // Security: Only the founder of that startup or an admin can update the status
        if ($startup->user_id !== auth()->id() && auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $interest->status = $request->status;
        $interest->save();

        return response()->json([
            'success' => true,
            'message' => 'Pipeline status updated successfully.',
            'data' => $interest
        ]);
    }
}
