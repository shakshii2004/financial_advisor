<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;

class EmailVerificationController extends Controller
{
    public function send(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json([
                'success' => true,
                'message' => 'Email already verified.',
                'data' => null
            ]);
        }
        $request->user()->sendEmailVerificationNotification();
        return response()->json([
            'success' => true,
            'message' => 'Verification link sent.',
            'data' => null
        ]);
    }

    public function verify(Request $request, $id, $hash): JsonResponse
    {
        $user = Auth::user();
        if (!$user || $user->getKey() != $id) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid verification link.',
                'data' => null
            ], 403);
        }
        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => true,
                'message' => 'Email already verified.',
                'data' => null
            ]);
        }
        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid verification hash.',
                'data' => null
            ], 403);
        }
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }
        return response()->json([
            'success' => true,
            'message' => 'Email verified successfully.',
            'data' => null
        ]);
    }
}
