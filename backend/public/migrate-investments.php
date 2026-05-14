<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

header('Content-Type: application/json');
$results = [];

try {
    if (!Schema::hasTable('investments')) {
        Schema::create('investments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('startup_id')->constrained()->onDelete('cascade');
            $table->foreignId('investor_id')->constrained('users')->onDelete('cascade');
            $table->decimal('amount', 18, 2)->nullable();
            $table->decimal('equity_percentage', 5, 2)->nullable();
            $table->string('status')->default('pending'); // pending, active, withdrawn
            $table->timestamps();
        });
        $results[] = "Table 'investments' created successfully.";
    } else {
        $results[] = "Table 'investments' already exists.";
    }

    if (!Schema::hasTable('funding_requests')) {
        Schema::create('funding_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('startup_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->decimal('target_amount', 15, 2);
            $table->decimal('equity_offered', 5, 2)->nullable();
            $table->text('pitch_details')->nullable();
            $table->string('stage')->default('Seed');
            $table->enum('status', ['pending', 'active', 'closed'])->default('active');
            $table->timestamps();
        });
        $results[] = "Table 'funding_requests' created successfully.";
    } else {
        $results[] = "Table 'funding_requests' already exists.";
    }

    if (!Schema::hasTable('investor_interests')) {
        Schema::create('investor_interests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // The investor
            $table->foreignId('startup_id')->constrained()->onDelete('cascade');
            $table->foreignId('funding_request_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('status', ['watching', 'interested', 'in_talks', 'passed', 'invested'])->default('watching');
            $table->text('message')->nullable();
            $table->timestamps();
        });
        $results[] = "Table 'investor_interests' created successfully.";
    } else {
        $results[] = "Table 'investor_interests' already exists.";
    }

    echo json_encode(['status' => 'success', 'messages' => $results]);
} catch (\Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
