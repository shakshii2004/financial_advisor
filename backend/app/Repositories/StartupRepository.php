<?php

namespace App\Repositories;

use App\Models\Startup;

class StartupRepository
{
    public function allForUser($user)
    {
        return Startup::where('user_id', $user->id)->get();
    }

    public function findForUser($user, $id)
    {
        return Startup::where('user_id', $user->id)->findOrFail($id);
    }

    public function createForUser($user, array $data)
    {
        $data['user_id'] = $user->id;
        return Startup::create($data);
    }

    public function updateForUser($user, $id, array $data)
    {
        $startup = $this->findForUser($user, $id);
        $startup->update($data);
        return $startup;
    }

    public function deleteForUser($user, $id)
    {
        $startup = $this->findForUser($user, $id);
        $startup->delete();
        return true;
    }
}
