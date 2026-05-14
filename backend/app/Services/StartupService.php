<?php

namespace App\Services;

use App\Repositories\StartupRepository;
use Illuminate\Support\Facades\Gate;

class StartupService
{
    protected $repo;

    public function __construct(StartupRepository $repo)
    {
        $this->repo = $repo;
    }

    public function list($user)
    {
        Gate::authorize('viewAny', 'App\\Models\\Startup');
        return $this->repo->allForUser($user);
    }

    public function get($user, $id)
    {
        Gate::authorize('view', 'App\\Models\\Startup');
        return $this->repo->findForUser($user, $id);
    }

    public function create($user, array $data)
    {
        Gate::authorize('create', 'App\\Models\\Startup');
        return $this->repo->createForUser($user, $data);
    }

    public function update($user, $id, array $data)
    {
        Gate::authorize('update', 'App\\Models\\Startup');
        return $this->repo->updateForUser($user, $id, $data);
    }

    public function delete($user, $id)
    {
        Gate::authorize('delete', 'App\\Models\\Startup');
        return $this->repo->deleteForUser($user, $id);
    }
}
