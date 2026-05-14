<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Startup;

class StartupPolicy
{
    public function viewAny(User $user)
    {
        return $user->role === 'founder' || $user->role === 'investor' || $user->role === 'admin';
    }

    public function view(User $user, Startup $startup)
    {
        return $user->role === 'admin' || $user->id === $startup->user_id;
    }

    public function update(User $user, Startup $startup)
    {
        return $user->role === 'admin' || $user->id === $startup->user_id;
    }

    public function create(User $user)
    {
        return $user->role === 'founder';
    }
}
