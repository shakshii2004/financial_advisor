<?php

namespace App\Http\Controllers;

use App\Services\StartupService;
use App\Http\Requests\StartupStoreRequest;
use App\Http\Requests\StartupUpdateRequest;
use App\Http\Resources\StartupResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StartupController extends Controller
{
    protected $service;

    public function __construct(StartupService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        $startups = $this->service->list($user);
        return response()->json([
            'success' => true,
            'data' => StartupResource::collection($startups),
        ]);
    }

    public function show($id)
    {
        $user = Auth::user();
        $startup = $this->service->get($user, $id);
        return response()->json([
            'success' => true,
            'data' => new StartupResource($startup),
        ]);
    }

    public function store(StartupStoreRequest $request)
    {
        $user = Auth::user();
        $startup = $this->service->create($user, $request->validated());
        return response()->json([
            'success' => true,
            'data' => new StartupResource($startup),
        ], 201);
    }

    public function update(StartupUpdateRequest $request, $id)
    {
        $user = Auth::user();
        $startup = $this->service->update($user, $id, $request->validated());
        return response()->json([
            'success' => true,
            'data' => new StartupResource($startup),
        ]);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $this->service->delete($user, $id);
        return response()->json([
            'success' => true,
        ]);
    }
}
