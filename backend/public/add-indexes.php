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

try {
    Schema::table('transactions', function (Blueprint $table) {
        // Drop the index if it exists, to be safe
        $sm = Schema::getConnection()->getDoctrineSchemaManager();
        $indexesFound = $sm->listTableIndexes('transactions');
        
        if (array_key_exists('idx_startup_type_date', $indexesFound)) {
            $table->dropIndex('idx_startup_type_date');
        }
    });

    Schema::table('transactions', function (Blueprint $table) {
        $table->index(['startup_id', 'type', 'date'], 'idx_startup_type_date');
    });

    echo json_encode(['status' => 'success', 'message' => 'Index added successfully!']);
} catch (\Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
