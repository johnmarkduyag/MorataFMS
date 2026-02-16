<?php

namespace App\Policies;

use App\Models\Client;
use App\Models\User;

class ClientPolicy
{
    /**
     * Any authenticated user can view clients.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Only supervisor+ can create clients.
     */
    public function create(User $user): bool
    {
        return $user->isSupervisorOrAbove();
    }

    /**
     * Only supervisor+ can update clients.
     */
    public function update(User $user, Client $client): bool
    {
        return $user->isSupervisorOrAbove();
    }

    /**
     * Only admin can delete clients.
     */
    public function delete(User $user, Client $client): bool
    {
        return $user->isAdmin();
    }
}
