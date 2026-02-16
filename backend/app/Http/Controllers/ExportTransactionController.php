<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreExportTransactionRequest;
use App\Http\Resources\ExportTransactionResource;
use App\Models\ExportTransaction;
use Illuminate\Http\Request;

class ExportTransactionController extends Controller
{
    /**
     * GET /api/export-transactions
     * Paginated list with optional search and filter.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', ExportTransaction::class);

        $query = ExportTransaction::with(['shipper', 'stages', 'assignedUser', 'destinationCountry']);

        // Search by BL number, vessel, or shipper name
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('bl_no', 'like', "%{$search}%")
                    ->orWhere('vessel', 'like', "%{$search}%")
                    ->orWhereHas('shipper', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by status
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $transactions = $query->orderBy('created_at', 'desc')->paginate(15);

        return ExportTransactionResource::collection($transactions);
    }

    /**
     * POST /api/export-transactions
     * Create a new export transaction.
     */
    public function store(StoreExportTransactionRequest $request)
    {
        $this->authorize('create', ExportTransaction::class);

        $transaction = new ExportTransaction($request->validated());
        $transaction->assigned_user_id = $request->user()->id;
        $transaction->status = 'pending';
        $transaction->save();

        $transaction->load(['shipper', 'stages', 'assignedUser', 'destinationCountry']);

        return (new ExportTransactionResource($transaction))
            ->response()
            ->setStatusCode(201);
    }
}
