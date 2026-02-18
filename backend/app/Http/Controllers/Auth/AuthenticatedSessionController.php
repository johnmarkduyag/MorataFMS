<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): JsonResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = $request->user();

        // Audit log: login
        AuditLog::record(
            action: 'login',
            description: "{$user->name} logged in.",
            userId: $user->id,
            ipAddress: $request->ip()
        );

        return response()->json([
            'user' => $user,
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        $user = Auth::user();

        // Audit log: logout (before session is invalidated)
        if ($user) {
            AuditLog::record(
                action: 'logout',
                description: "{$user->name} logged out.",
                userId: $user->id,
                ipAddress: $request->ip()
            );
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
