<?php

namespace App\Services;

use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    public function getSummaryMetrics($startupId)
    {
        $now = Carbon::now();
        $startOfThisMonth = $now->copy()->startOfMonth()->format('Y-m-d');
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth()->format('Y-m-d');
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth()->format('Y-m-d');

        // Fetch all required aggregates in a SINGLE highly-optimized query
        $result = Transaction::where('startup_id', $startupId)
            ->selectRaw("
                SUM(CASE WHEN type = 'revenue' THEN amount ELSE 0 END) as total_revenue,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
                SUM(CASE WHEN type = 'revenue' AND date >= ? THEN amount ELSE 0 END) as this_month_revenue,
                SUM(CASE WHEN type = 'expense' AND date >= ? THEN amount ELSE 0 END) as this_month_expenses,
                SUM(CASE WHEN type = 'revenue' AND date BETWEEN ? AND ? THEN amount ELSE 0 END) as last_month_revenue,
                SUM(CASE WHEN type = 'expense' AND date BETWEEN ? AND ? THEN amount ELSE 0 END) as last_month_expenses,
                MIN(date) as first_transaction_date
            ", [
                $startOfThisMonth, 
                $startOfThisMonth, 
                $startOfLastMonth, $endOfLastMonth,
                $startOfLastMonth, $endOfLastMonth
            ])->first();

        $totalRevenue = (float) ($result->total_revenue ?? 0);
        $totalExpenses = (float) ($result->total_expenses ?? 0);
        $thisMonthRevenue = (float) ($result->this_month_revenue ?? 0);
        $thisMonthExpenses = (float) ($result->this_month_expenses ?? 0);
        $lastMonthRevenue = (float) ($result->last_month_revenue ?? 0);
        $lastMonthExpenses = (float) ($result->last_month_expenses ?? 0);
        $firstDate = $result->first_transaction_date ? Carbon::parse($result->first_transaction_date) : $now;

        // Calculations
        $netProfit = $totalRevenue - $totalExpenses;
        $monthsActive = max(1, $firstDate->diffInMonths($now));
        $monthlyBurnRate = $thisMonthExpenses > 0 ? $thisMonthExpenses : ($totalExpenses / $monthsActive);
        
        $revenueGrowth = 0;
        if ($lastMonthRevenue > 0) {
            $revenueGrowth = (($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100;
        }

        $balance = 500000 + $netProfit; // Assuming starting capital of 500k for demonstration, ideally from DB
        $runwayMonths = $monthlyBurnRate > 0 ? round($balance / $monthlyBurnRate, 1) : 0;

        return [
            'total_revenue' => round($totalRevenue, 2),
            'total_expenses' => round($totalExpenses, 2),
            'net_profit' => round($netProfit, 2),
            'monthly_burn_rate' => round($monthlyBurnRate, 2),
            'revenue_growth_percentage' => round($revenueGrowth, 2),
            'runway_months' => $runwayMonths,
            'current_balance' => round($balance, 2)
        ];
    }

    public function getChartData($startupId, $period)
    {
        $months = 6;
        if ($period === '1m') $months = 1;
        if ($period === '3m') $months = 3;
        if ($period === '1y') $months = 12;

        $startDate = Carbon::now()->subMonths($months - 1)->startOfMonth();

        $transactions = Transaction::where('startup_id', $startupId)
            ->where('date', '>=', $startDate)
            ->select(
                DB::raw("TO_CHAR(date, 'YYYY-MM') as month"),
                'type',
                DB::raw('SUM(amount) as total')
            )
            ->groupBy('month', 'type')
            ->orderBy('month')
            ->get();

        $chartData = [];
        // Initialize all months
        for ($i = 0; $i < $months; $i++) {
            $monthStr = Carbon::now()->subMonths($months - 1 - $i)->format('Y-m');
            $chartData[$monthStr] = [
                'month' => Carbon::now()->subMonths($months - 1 - $i)->format('M Y'),
                'revenue' => 0,
                'expense' => 0
            ];
        }

        foreach ($transactions as $t) {
            $monthKey = $t->month;
            if (isset($chartData[$monthKey])) {
                $chartData[$monthKey][$t->type] = (float) $t->total;
            }
        }

        return array_values($chartData);
    }
}
