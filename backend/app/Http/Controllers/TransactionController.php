<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Transaction::query()
            ->whereHas('startup', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });

        if ($request->has('startup_id')) {
            $query->where('startup_id', $request->startup_id);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        return response()->json([
            'success' => true,
            'data' => $query->latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'startup_id' => 'required|exists:startups,id',
            'type' => 'required|in:revenue,expense',
            'category' => 'required|string',
            'amount' => 'required|numeric',
            'date' => 'required|date',
            'description' => 'nullable|string',
            'status' => 'string',
            'currency' => 'nullable|string|in:USD,INR',
        ]);

        // Verify ownership
        $startup = \App\Models\Startup::findOrFail($validated['startup_id']);
        if ($startup->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $transaction = Transaction::create($validated);

        return response()->json([
            'success' => true,
            'data' => $transaction
        ], 201);
    }

    public function show(Transaction $transaction)
    {
        if ($transaction->startup->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json([
            'success' => true,
            'data' => $transaction
        ]);
    }

    public function update(Request $request, Transaction $transaction)
    {
        if ($transaction->startup->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'category' => 'string',
            'amount' => 'numeric',
            'date' => 'date',
            'description' => 'nullable|string',
            'status' => 'string',
            'currency' => 'nullable|string|in:USD,INR',
        ]);

        $transaction->update($validated);

        return response()->json([
            'success' => true,
            'data' => $transaction
        ]);
    }

    public function destroy(Transaction $transaction)
    {
        if ($transaction->startup->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $transaction->delete();
        return response()->json(['success' => true], 200);
    }
}
