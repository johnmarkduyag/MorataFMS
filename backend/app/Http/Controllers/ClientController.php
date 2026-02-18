<?php

namespace App\Http\Controllers;

use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $clients = Client::with('country')->orderBy('created_at', 'desc')->get();
        return ClientResource::collection($clients);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::in(['importer', 'exporter', 'both'])],
            'country_id' => ['nullable', 'exists:countries,id'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string'],
        ]);

        $client = Client::create([
            ...$validated,
            'is_active' => true,
        ]);

        return new ClientResource($client->load('country'));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $client = Client::with('country')->findOrFail($id);
        return new ClientResource($client);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $client = Client::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'type' => ['sometimes', Rule::in(['importer', 'exporter', 'both'])],
            'country_id' => ['nullable', 'exists:countries,id'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string'],
        ]);

        $client->update($validated);

        return new ClientResource($client->load('country'));
    }

    /**
     * Toggle active status of a client.
     */
    public function toggleActive(string $id)
    {
        $client = Client::findOrFail($id);
        $client->update(['is_active' => !$client->is_active]);

        return new ClientResource($client->load('country'));
    }

    /**
     * Get transaction history for a client.
     */
    public function transactions(string $id)
    {
        $client = Client::findOrFail($id);

        $imports = $client->importTransactions()
            ->with(['assignedUser:id,name', 'importer:id,name'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'type' => 'import',
                    'reference_no' => $transaction->customs_ref_no,
                    'bl_no' => $transaction->bl_no,
                    'date' => $transaction->arrival_date,
                    'status' => $transaction->status,
                    'selective_color' => $transaction->selective_color,
                    'assigned_to' => $transaction->assignedUser?->name,
                    'created_at' => $transaction->created_at?->toISOString(),
                ];
            });

        $exports = $client->exportTransactions()
            ->with(['assignedUser:id,name', 'shipper:id,name', 'destinationCountry:id,name'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'type' => 'export',
                    'bl_no' => $transaction->bl_no,
                    'vessel' => $transaction->vessel,
                    'destination' => $transaction->destinationCountry?->name,
                    'status' => $transaction->status,
                    'assigned_to' => $transaction->assignedUser?->name,
                    'created_at' => $transaction->created_at?->toISOString(),
                ];
            });

        return response()->json([
            'client' => new ClientResource($client),
            'transactions' => [
                'imports' => $imports,
                'exports' => $exports,
                'total' => $imports->count() + $exports->count(),
            ],
        ]);
    }
}
