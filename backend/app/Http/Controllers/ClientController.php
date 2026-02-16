<?php

namespace App\Http\Controllers;

use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * GET /api/clients
     * List active clients, optionally filtered by type.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Client::class);

        $query = Client::active()->orderBy('name');

        // Filter by type (importer, exporter, both)
        if ($type = $request->query('type')) {
            if ($type === 'importer') {
                $query->importers();
            } elseif ($type === 'exporter') {
                $query->exporters();
            }
        }

        return ClientResource::collection($query->get());
    }
}
