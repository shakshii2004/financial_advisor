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
    // Create Startups Table
    if (!Schema::hasTable('startups')) {
        Schema::create('startups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('logo_url')->nullable();
            $table->text('description')->nullable();
            $table->string('industry')->nullable();
            $table->string('stage')->nullable();
            $table->string('website')->nullable();
            $table->unsignedInteger('team_size')->nullable();
            $table->decimal('valuation', 18, 2)->nullable();
            $table->timestamps();
        });
        $results[] = "Table 'startups' created successfully.";
    } else {
        $results[] = "Table 'startups' already exists.";
    }

    // Create Transactions Table
    if (!Schema::hasTable('transactions')) {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('startup_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['revenue', 'expense']);
            $table->string('category');
            $table->decimal('amount', 15, 2);
            $table->date('date');
            $table->text('description')->nullable();
            $table->string('status')->default('completed');
            $table->timestamps();
        });
        $results[] = "Table 'transactions' created successfully.";
    } else {
        $results[] = "Table 'transactions' already exists.";
    }

    echo json_encode(['status' => 'success', 'messages' => $results]);
} catch (\Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
