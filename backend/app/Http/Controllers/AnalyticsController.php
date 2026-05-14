<?php

namespace App\Http\Controllers;

use App\Services\AnalyticsService;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    protected $service;

    public function __construct(AnalyticsService $service)
    {
        $this->service = $service;
    }

    public function summary(Request $request)
    {
        $request->validate([
            'startup_id' => 'required|exists:startups,id',
        ]);

        $startup_id = $request->startup_id;
        $startup = \App\Models\Startup::findOrFail($startup_id);

        // Security check
        if ($startup->user_id !== auth()->id() && auth()->user()->role !== 'admin' && auth()->user()->role !== 'investor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $metrics = $this->service->getSummaryMetrics($startup_id);

        // Cap Table Logic: Use DB if exists, otherwise generate realistic demo data
        $isVerified = !is_null($startup->cap_table);
        $capTable = $startup->cap_table ?? [
            ['name' => 'Founders', 'equity' => 65.5, 'color' => '#171717'],
            ['name' => 'Seed Investors', 'equity' => 20.0, 'color' => '#737373'],
            ['name' => 'ESOP Pool', 'equity' => 10.0, 'color' => '#a3a3a3'],
            ['name' => 'Advisors', 'equity' => 4.5, 'color' => '#e5e5e5'],
        ];

        return response()->json([
            'success' => true,
            'data' => array_merge($metrics, [
                'cap_table' => $capTable,
                'pitch_deck_url' => $startup->pitch_deck_url ?? '#',
                'team_size' => $startup->team_size ?? 0,
                'is_verified' => $isVerified
            ])
        ]);
    }

    public function chartData(Request $request)
    {
        $request->validate([
            'startup_id' => 'required|exists:startups,id',
            'period' => 'in:1m,3m,6m,1y,all',
        ]);

        $startup_id = $request->startup_id;
        $startup = \App\Models\Startup::findOrFail($startup_id);

        // Security check
        if ($startup->user_id !== auth()->id() && auth()->user()->role !== 'admin' && auth()->user()->role !== 'investor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $period = $request->get('period', '6m');
        $chartData = $this->service->getChartData($startup_id, $period);

        return response()->json([
            'success' => true,
            'data' => $chartData
        ]);
    }

    public function investorSummary(Request $request)
    {
        $user = auth()->user();
        
        if ($user->role !== 'investor' && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Calculate Real Portfolio Stats
        $portfolioValue = \App\Models\Investment::where('investor_id', $user->id)
            ->where('status', 'active')
            ->sum('amount');

        $activeInvestments = \App\Models\Investment::where('investor_id', $user->id)
            ->where('status', 'active')
            ->count();

        $pendingInterests = \App\Models\InvestorInterest::where('user_id', $user->id)
            ->whereIn('status', ['interested', 'watching'])
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'portfolio_value' => (float)$portfolioValue,
                'active_investments' => $activeInvestments,
                'pending_interests' => $pendingInterests,
                'co_investors' => 42, // Mocked for now
                'avg_runway' => '14m', // Mocked for now
            ]
        ]);
    }
}
