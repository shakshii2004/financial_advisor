<?php

namespace App\Http\Controllers;

use App\Models\Startup;
use App\Models\FundingRequest;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->get('q');
        
        if (empty($query)) {
            return response()->json(['data' => []]);
        }

        // Search Startups (Case-insensitive)
        $startups = Startup::whereRaw('LOWER(name) LIKE ?', ["%".strtolower($query)."%"])
            ->orWhereRaw('LOWER(industry) LIKE ?', ["%".strtolower($query)."%"])
            ->orWhereRaw('LOWER(description) LIKE ?', ["%".strtolower($query)."%"])
            ->limit(5)
            ->get()
            ->map(function($item) {
                $item->type = 'startup';
                return $item;
            });

        // Search Funding Requests / Stages (Case-insensitive)
        $funding = FundingRequest::with('startup')
            ->whereRaw('LOWER(title) LIKE ?', ["%".strtolower($query)."%"])
            ->orWhereRaw('LOWER(stage) LIKE ?', ["%".strtolower($query)."%"])
            ->limit(3)
            ->get()
            ->map(function($item) {
                $item->type = 'funding';
                return $item;
            });

        $results = $startups->concat($funding);

        return response()->json([
            'success' => true,
            'data' => $results
        ]);
    }
}
