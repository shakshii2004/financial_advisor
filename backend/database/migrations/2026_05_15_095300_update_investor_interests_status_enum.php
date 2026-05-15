<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Change enum to string to allow any status value
        // We use raw SQL to ensure it works across different drivers and avoids enum locked-in
        Schema::table('investor_interests', function (Blueprint $table) {
            $table->string('status')->default('interested')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('investor_interests', function (Blueprint $table) {
            $table->enum('status', ['watching', 'interested', 'in_talks', 'passed', 'invested'])->default('watching')->change();
        });
    }
};
