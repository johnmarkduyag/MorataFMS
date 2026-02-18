<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\ImportTransaction;
use App\Models\ExportTransaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class TransactionController extends Controller
{
    /**
     * Get all transactions (imports + exports) combined.
     */
    public function index()
    {
        $imports = ImportTransaction::with(['importer:id,name', 'assignedUser:id,name'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($t) {
                return [
                    'id' => $t->id,
                    'type' => 'import',
                    'reference_no' => $t->customs_ref_no,
                    'bl_no' => $t->bl_no,
                    'client' => $t->importer?->name,
                    'client_id' => $t->importer_id,
                    'date' => $t->arrival_date?->toDateString(),
                    'status' => $t->status,
                    'selective_color' => $t->selective_color,
                    'assigned_to' => $t->assignedUser?->name,
                    'assigned_user_id' => $t->assigned_user_id,
                    'created_at' => $t->created_at?->toISOString(),
                ];
            });

        $exports = ExportTransaction::with(['shipper:id,name', 'assignedUser:id,name', 'destinationCountry:id,name'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($t) {
                return [
                    'id' => $t->id,
                    'type' => 'export',
                    'reference_no' => null,
                    'bl_no' => $t->bl_no,
                    'client' => $t->shipper?->name,
                    'client_id' => $t->shipper_id,
                    'vessel' => $t->vessel,
                    'destination' => $t->destinationCountry?->name,
                    'date' => $t->created_at?->toDateString(),
                    'status' => $t->status,
                    'assigned_to' => $t->assignedUser?->name,
                    'assigned_user_id' => $t->assigned_user_id,
                    'created_at' => $t->created_at?->toISOString(),
                ];
            });

        $all = $imports->concat($exports)->sortByDesc('created_at')->values();

        return response()->json([
            'data' => $all,
            'total' => $all->count(),
            'imports_count' => $imports->count(),
            'exports_count' => $exports->count(),
        ]);
    }

    /**
     * Reassign encoder for an import transaction.
     */
    public function reassignImport(Request $request, string $id)
    {
        $validated = $request->validate([
            'assigned_user_id' => ['required', 'exists:users,id'],
        ]);

        $transaction = ImportTransaction::findOrFail($id);
        $oldEncoder = $transaction->assignedUser?->name ?? 'None';
        $transaction->update(['assigned_user_id' => $validated['assigned_user_id']]);
        $transaction->load('assignedUser:id,name');
        $newEncoder = $transaction->assignedUser?->name ?? 'Unknown';

        $actor = Auth::user();
        AuditLog::record(
            action: 'encoder_reassigned',
            description: "{$actor->name} reassigned import #{$id} (BL: {$transaction->bl_no}) from {$oldEncoder} to {$newEncoder}.",
            userId: $actor->id,
            subjectType: 'import',
            subjectId: (int) $id,
            ipAddress: $request->ip()
        );

        return response()->json([
            'message' => 'Encoder reassigned successfully.',
            'assigned_to' => $transaction->assignedUser?->name,
            'assigned_user_id' => $transaction->assigned_user_id,
        ]);
    }

    /**
     * Reassign encoder for an export transaction.
     */
    public function reassignExport(Request $request, string $id)
    {
        $validated = $request->validate([
            'assigned_user_id' => ['required', 'exists:users,id'],
        ]);

        $transaction = ExportTransaction::findOrFail($id);
        $oldEncoder = $transaction->assignedUser?->name ?? 'None';
        $transaction->update(['assigned_user_id' => $validated['assigned_user_id']]);
        $transaction->load('assignedUser:id,name');
        $newEncoder = $transaction->assignedUser?->name ?? 'Unknown';

        $actor = Auth::user();
        AuditLog::record(
            action: 'encoder_reassigned',
            description: "{$actor->name} reassigned export #{$id} (BL: {$transaction->bl_no}) from {$oldEncoder} to {$newEncoder}.",
            userId: $actor->id,
            subjectType: 'export',
            subjectId: (int) $id,
            ipAddress: $request->ip()
        );

        return response()->json([
            'message' => 'Encoder reassigned successfully.',
            'assigned_to' => $transaction->assignedUser?->name,
            'assigned_user_id' => $transaction->assigned_user_id,
        ]);
    }

    /**
     * Override status for an import transaction.
     */
    public function overrideImportStatus(Request $request, string $id)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'in_progress', 'completed', 'cancelled'])],
        ]);

        $transaction = ImportTransaction::findOrFail($id);
        $oldStatus = $transaction->status;
        $transaction->update(['status' => $validated['status']]);

        $actor = Auth::user();
        AuditLog::record(
            action: 'status_changed',
            description: "{$actor->name} changed import #{$id} (BL: {$transaction->bl_no}) status from {$oldStatus} to {$validated['status']}.",
            userId: $actor->id,
            subjectType: 'import',
            subjectId: (int) $id,
            ipAddress: $request->ip()
        );

        return response()->json([
            'message' => 'Status updated successfully.',
            'status' => $transaction->status,
        ]);
    }

    /**
     * Override status for an export transaction.
     */
    public function overrideExportStatus(Request $request, string $id)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'in_progress', 'completed', 'cancelled'])],
        ]);

        $transaction = ExportTransaction::findOrFail($id);
        $oldStatus = $transaction->status;
        $transaction->update(['status' => $validated['status']]);

        $actor = Auth::user();
        AuditLog::record(
            action: 'status_changed',
            description: "{$actor->name} changed export #{$id} (BL: {$transaction->bl_no}) status from {$oldStatus} to {$validated['status']}.",
            userId: $actor->id,
            subjectType: 'export',
            subjectId: (int) $id,
            ipAddress: $request->ip()
        );

        return response()->json([
            'message' => 'Status updated successfully.',
            'status' => $transaction->status,
        ]);
    }

    /**
     * Get all active encoder users for the reassign dropdown.
     */
    public function encoders()
    {
        $encoders = User::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'role']);

        return response()->json(['data' => $encoders]);
    }
}
