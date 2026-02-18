<?php

namespace App\Http\Controllers;

use App\Http\Resources\ClientResource;
use App\Http\Resources\ImportTransactionResource;
use App\Http\Resources\ExportTransactionResource;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * GET /api/clients
     * List all clients (including inactive for admin), optionally filtered by type.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Client::class);

        $query = Client::with('country')->orderBy('name');

        // Admin sees all clients; others only see active
        if (!$request->user()->isAdmin()) {
            $query->active();
        }

        // Filter by type
        if ($type = $request->query('type')) {
            if ($type === 'importer') {
                $query->importers();
            } elseif ($type === 'exporter') {
                $query->exporters();
            }
        }

        return ClientResource::collection($query->get());
    }

    /**
     * POST /api/clients
     */
    public function store(Request $request)
    {
        $this->authorize('create', Client::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:importer,exporter,both',
            'country_id' => 'nullable|exists:countries,id',
            'contact_person' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:1000',
        ]);

        $client = new Client($validated);
        $client->is_active = true; // server-managed
        $client->save();

        return new ClientResource($client->load('country'));
    }

    /**
     * GET /api/clients/{client}
     */
    public function show(Client $client)
    {
        $this->authorize('view', $client);

        return new ClientResource($client->load('country'));
    }

    /**
     * PUT /api/clients/{client}
     */
    public function update(Request $request, Client $client)
    {
        $this->authorize('update', $client);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|in:importer,exporter,both',
            'country_id' => 'nullable|exists:countries,id',
            'contact_person' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:1000',
        ]);

        $client->fill($validated);
        $client->save();

        return new ClientResource($client->load('country'));
    }

    /**
     * DELETE /api/clients/{client}
     */
    public function destroy(Client $client)
    {
        $this->authorize('delete', $client);
        $client->delete();
        return response()->noContent();
    }

    /**
     * POST /api/clients/{client}/toggle-active
     */
    public function toggleActive(Client $client)
    {
        $this->authorize('update', $client);
        $client->is_active = !$client->is_active;
        $client->save();
        return new ClientResource($client->load('country'));
    }

    /**
     * GET /api/clients/{client}/transactions
     */
    public function transactions(Client $client)
    {
        $this->authorize('view', $client);

        $imports = $client->importTransactions()->with('encoder')->latest()->get();
        $exports = $client->exportTransactions()->with('encoder')->latest()->get();

        return response()->json([
            'transactions' => [
                'imports' => ImportTransactionResource::collection($imports),
                'exports' => ExportTransactionResource::collection($exports),
            ],
        ]);
    }
}
