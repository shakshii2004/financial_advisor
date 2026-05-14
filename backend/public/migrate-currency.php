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
    if (Schema::hasTable('startups')) {
        Schema::table('startups', function (Blueprint $table) {
            if (!Schema::hasColumn('startups', 'currency')) {
                $table->string('currency')->default('USD');
                $results[] = "Added currency column to startups table.";
            }
        });
    }

    if (Schema::hasTable('transactions')) {
        Schema::table('transactions', function (Blueprint $table) {
            if (!Schema::hasColumn('transactions', 'currency')) {
                $table->string('currency')->default('USD');
                $results[] = "Added currency column to transactions table.";
            }
        });
    }

    echo json_encode(['status' => 'success', 'messages' => $results]);
} catch (\Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
