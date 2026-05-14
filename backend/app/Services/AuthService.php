<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\Registered;

class AuthService
{
    public function register(array $data): User
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
        ]);
        event(new Registered($user));
        return $user;
    }

    public function login(array $data): array
    {
        try {
            if (!Auth::attempt(['email' => $data['email'], 'password' => $data['password']])) {
                return ['success' => false, 'message' => 'Invalid email or password.'];
            }
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Database Error: ' . $e->getMessage()];
        }
        $user = Auth::user();
        return ['success' => true, 'user' => $user];
    }

    public function logout($user): void
    {
        Auth::logout();
    }
}
