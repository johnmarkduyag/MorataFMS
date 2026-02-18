<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Only admins can view user listings.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Only admins can create new users.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Only admins can update other users.
     * Users cannot update themselves via this endpoint.
     */
    public function update(User $user, User $targetUser): bool
    {
        return $user->isAdmin() && $user->id !== $targetUser->id;
    }

    /**
     * Only admins can delete users.
     * Admins cannot delete themselves.
     */
    public function delete(User $user, User $targetUser): bool
    {
        return $user->isAdmin() && $user->id !== $targetUser->id;
    }
}
