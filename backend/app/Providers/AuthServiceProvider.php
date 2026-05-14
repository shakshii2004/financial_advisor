<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Startup;
use App\Policies\StartupPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Startup::class => StartupPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        Gate::define('is-founder', function ($user) {
            return $user->role === 'founder';
        });
        Gate::define('is-investor', function ($user) {
            return $user->role === 'investor';
        });
        Gate::define('is-admin', function ($user) {
            return $user->role === 'admin';
        });
    }
}
