<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    /**
     * GET /api/audit-logs
     * Paginated, filterable audit log list.
     */
    public function index(Request $request)
    {
        $query = AuditLog::with('user:id,name,email,role')
            ->orderBy('created_at', 'desc');

        // Filter by action type
        if ($action = $request->query('action')) {
            $query->where('action', $action);
        }

        // Filter by user
        if ($userId = $request->query('user_id')) {
            $query->where('user_id', (int) $userId);
        }

        // Filter by date range
        if ($dateFrom = $request->query('date_from')) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }
        if ($dateTo = $request->query('date_to')) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        // Search in description
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$search}%"));
            });
        }

        $perPage = (int) $request->query('per_page', 25);
        $logs = $query->paginate($perPage);

        return response()->json([
            'data' => $logs->items(),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
            ],
        ]);
    }

    /**
     * GET /api/audit-logs/actions
     * Returns distinct action types for the filter dropdown.
     */
    public function actions()
    {
        $actions = AuditLog::distinct()->orderBy('action')->pluck('action');
        return response()->json(['data' => $actions]);
    }
}
