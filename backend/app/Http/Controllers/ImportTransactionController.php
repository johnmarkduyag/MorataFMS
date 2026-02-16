<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreImportTransactionRequest;
use App\Http\Resources\ImportTransactionResource;
use App\Models\ImportTransaction;
use Illuminate\Http\Request;

class ImportTransactionController extends Controller
{
    /**
     * GET /api/import-transactions
     * Paginated list with optional search and filter.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', ImportTransaction::class);

        $query = ImportTransaction::with(['importer', 'stages', 'assignedUser']);

        // Search by customs ref or BL number
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('customs_ref_no', 'like', "%{$search}%")
                    ->orWhere('bl_no', 'like', "%{$search}%")
                    ->orWhereHas('importer', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by status
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        // Filter by selective color
        if ($color = $request->query('selective_color')) {
            $query->where('selective_color', $color);
        }

        $transactions = $query->orderBy('created_at', 'desc')->paginate(15);

        return ImportTransactionResource::collection($transactions);
    }

    /**
     * POST /api/import-transactions
     * Create a new import transaction.
     */
    public function store(StoreImportTransactionRequest $request)
    {
        $this->authorize('create', ImportTransaction::class);

        $transaction = new ImportTransaction($request->validated());
        $transaction->assigned_user_id = $request->user()->id;
        $transaction->status = 'pending';
        $transaction->save();

        $transaction->load(['importer', 'stages', 'assignedUser']);

        return (new ImportTransactionResource($transaction))
            ->response()
            ->setStatusCode(201);
    }
}
