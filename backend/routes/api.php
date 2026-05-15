<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmailVerificationController;

use App\Http\Controllers\StartupController;
use App\Http\Controllers\TransactionController;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('me', [AuthController::class, 'me'])->middleware('auth:sanctum');
    Route::post('email/verify/send', [EmailVerificationController::class, 'send'])->middleware('auth:sanctum');
    Route::get('email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
        ->middleware('auth:sanctum')
        ->name('verification.verify');
});

Route::get('migrate-status', function () {
    try {
        if (\Illuminate\Support\Facades\Schema::hasTable('investor_interests')) {
            // Postgres syntax to change column type
            \Illuminate\Support\Facades\DB::statement("ALTER TABLE investor_interests ALTER COLUMN status TYPE VARCHAR(255)");
            \Illuminate\Support\Facades\DB::statement("ALTER TABLE investor_interests ALTER COLUMN status SET DEFAULT 'interested'");
            return 'Success: Status column converted to VARCHAR';
        }
        return 'Error: Table investor_interests not found';
    } catch (\Exception $e) {
        return $e->getMessage();
    }
});

Route::get('migrate-currency', function () {
    try {
        if (\Illuminate\Support\Facades\Schema::hasTable('startups')) {
            \Illuminate\Support\Facades\Schema::table('startups', function (\Illuminate\Database\Schema\Blueprint $table) {
                if (!\Illuminate\Support\Facades\Schema::hasColumn('startups', 'currency')) {
                    $table->string('currency')->default('USD');
                }
            });
        }
    
        if (\Illuminate\Support\Facades\Schema::hasTable('transactions')) {
            \Illuminate\Support\Facades\Schema::table('transactions', function (\Illuminate\Database\Schema\Blueprint $table) {
                if (!\Illuminate\Support\Facades\Schema::hasColumn('transactions', 'currency')) {
                    $table->string('currency')->default('USD');
                }
            });
        }
        return 'Success';
    } catch (\Exception $e) {
        return $e->getMessage();
    }
});

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('startups', StartupController::class);
    Route::apiResource('transactions', TransactionController::class);
    
    // Analytics
    Route::get('analytics/summary', [\App\Http\Controllers\AnalyticsController::class, 'summary']);
    Route::get('analytics/investor/summary', [\App\Http\Controllers\AnalyticsController::class, 'investorSummary']);
    Route::get('analytics/chart', [\App\Http\Controllers\AnalyticsController::class, 'chartData']);

    // Investments / Investor Access
    Route::get('investments/investors', [\App\Http\Controllers\InvestmentController::class, 'getInvestors']);
    Route::get('investments/portfolio', [\App\Http\Controllers\InvestmentController::class, 'getPortfolio']);
    Route::post('investments/add', [\App\Http\Controllers\InvestmentController::class, 'addInvestment']);
    Route::get('investments/discovery', [\App\Http\Controllers\InvestmentController::class, 'getDiscovery']);
    Route::post('investments/interest', [\App\Http\Controllers\InvestmentController::class, 'expressInterest']);
    Route::get('investments/interests', [\App\Http\Controllers\InvestmentController::class, 'getInterests']);
    Route::get('investments/startup-interests', [\App\Http\Controllers\InvestmentController::class, 'getStartupInterests']);
    Route::post('investments/update-status', [\App\Http\Controllers\InvestmentController::class, 'updateInterestStatus']);

    // Media
    Route::post('media/logo', [\App\Http\Controllers\MediaController::class, 'uploadLogo']);

    // Settings
    Route::put('settings/profile', [\App\Http\Controllers\SettingsController::class, 'updateProfile']);
    Route::put('settings/password', [\App\Http\Controllers\SettingsController::class, 'updatePassword']);

    // Search
    Route::get('search', [\App\Http\Controllers\SearchController::class, 'index']);
});
