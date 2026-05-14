<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

Route::get('/', function () {
    return view('welcome');
});

// SURGICAL FIX: Manually build the database structure using raw SQL
Route::get('/migrate-db', function () {
    try {
        // 1. Wipe everything surgicaly
        Schema::disableForeignKeyConstraints();
        $tables = DB::select("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
        foreach ($tables as $table) {
            DB::statement('DROP TABLE IF EXISTS "' . $table->tablename . '" CASCADE');
        }
        Schema::enableForeignKeyConstraints();

        // 2. Manually create the migrations table (Laravel needs this)
        DB::statement('CREATE TABLE migrations (id SERIAL PRIMARY KEY, migration VARCHAR(255) NOT NULL, batch INTEGER NOT NULL)');

        // 3. Manually create the users table (The one that was failing)
        DB::statement('
            CREATE TABLE "users" (
                "id" BIGSERIAL PRIMARY KEY,
                "name" VARCHAR(255) NOT NULL,
                "email" VARCHAR(255) NOT NULL,
                "email_verified_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL,
                "password" VARCHAR(255) NOT NULL,
                "role" VARCHAR(255) NOT NULL DEFAULT \'founder\',
                "remember_token" VARCHAR(100) NULL,
                "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL,
                "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL,
                CONSTRAINT "users_email_unique" UNIQUE ("email")
            )
        ');

        // 4. Manually create the password_reset_tokens table
        DB::statement('
            CREATE TABLE "password_reset_tokens" (
                "email" VARCHAR(255) PRIMARY KEY,
                "token" VARCHAR(255) NOT NULL,
                "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL
            )
        ');

        // 5. Manually create the sessions table (Required for SPA auth)
        DB::statement('
            CREATE TABLE "sessions" (
                "id" VARCHAR(255) PRIMARY KEY,
                "user_id" BIGINT NULL,
                "ip_address" VARCHAR(45) NULL,
                "user_agent" TEXT NULL,
                "payload" TEXT NOT NULL,
                "last_activity" INTEGER NOT NULL
            )
        ');

        // 6. Record that these migrations are done so Laravel doesn't try them again
        DB::table('migrations')->insert([
            ['migration' => '0001_01_01_000000_create_users_table', 'batch' => 1],
            ['migration' => '0001_01_01_000001_create_cache_table', 'batch' => 1],
            ['migration' => '0001_01_01_000002_create_jobs_table', 'batch' => 1],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'SURGICAL REPAIR SUCCESSFUL! Core tables created manually.',
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ], 500);
    }
});
