<?php

namespace App\Http\Controllers;

use App\Models\ImportTransaction;
use App\Models\ExportTransaction;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Monthly transaction volume for a given year.
     * GET /api/reports/monthly?year=YYYY
     */
    public function monthly(Request $request)
    {
        $year = (int) $request->query('year', now()->year);

        $months = [];
        for ($m = 1; $m <= 12; $m++) {
            $months[$m] = ['month' => $m, 'imports' => 0, 'exports' => 0, 'total' => 0];
        }

        // Import counts per month — SQLite compatible strftime
        $importCounts = ImportTransaction::selectRaw("CAST(strftime('%m', created_at) AS INTEGER) as month, COUNT(*) as count")
            ->whereRaw("strftime('%Y', created_at) = ?", [(string) $year])
            ->groupByRaw("strftime('%m', created_at)")
            ->pluck('count', 'month');

        // Export counts per month — SQLite compatible strftime
        $exportCounts = ExportTransaction::selectRaw("CAST(strftime('%m', created_at) AS INTEGER) as month, COUNT(*) as count")
            ->whereRaw("strftime('%Y', created_at) = ?", [(string) $year])
            ->groupByRaw("strftime('%m', created_at)")
            ->pluck('count', 'month');

        for ($m = 1; $m <= 12; $m++) {
            $imports = (int) ($importCounts[$m] ?? 0);
            $exports = (int) ($exportCounts[$m] ?? 0);
            $months[$m] = [
                'month' => $m,
                'imports' => $imports,
                'exports' => $exports,
                'total' => $imports + $exports,
            ];
        }

        $totalImports = array_sum(array_column($months, 'imports'));
        $totalExports = array_sum(array_column($months, 'exports'));

        return response()->json([
            'year' => $year,
            'months' => array_values($months),
            'total_imports' => $totalImports,
            'total_exports' => $totalExports,
            'total' => $totalImports + $totalExports,
        ]);
    }

    /**
     * Transaction counts per client for a given year (and optional month).
     * GET /api/reports/clients?year=YYYY&month=MM
     */
    public function clients(Request $request)
    {
        $year = (int) $request->query('year', now()->year);
        $month = $request->query('month'); // null = whole year

        $monthPad = $month ? str_pad((string) (int) $month, 2, '0', STR_PAD_LEFT) : null;

        // Imports per client
        $importQuery = ImportTransaction::selectRaw('importer_id as client_id, COUNT(*) as imports')
            ->with('importer:id,name,type')
            ->whereRaw("strftime('%Y', created_at) = ?", [(string) $year])
            ->whereNotNull('importer_id');

        if ($monthPad) {
            $importQuery->whereRaw("strftime('%m', created_at) = ?", [$monthPad]);
        }

        $importsByClient = $importQuery->groupBy('importer_id')->get()->keyBy('client_id');

        // Exports per client
        $exportQuery = ExportTransaction::selectRaw('shipper_id as client_id, COUNT(*) as exports')
            ->with('shipper:id,name,type')
            ->whereRaw("strftime('%Y', created_at) = ?", [(string) $year])
            ->whereNotNull('shipper_id');

        if ($monthPad) {
            $exportQuery->whereRaw("strftime('%m', created_at) = ?", [$monthPad]);
        }

        $exportsByClient = $exportQuery->groupBy('shipper_id')->get()->keyBy('client_id');

        // Merge both sets of client IDs
        $clientIds = $importsByClient->keys()->merge($exportsByClient->keys())->unique();

        $rows = $clientIds->map(function ($clientId) use ($importsByClient, $exportsByClient) {
            $importRow = $importsByClient->get($clientId);
            $exportRow = $exportsByClient->get($clientId);
            $client = $importRow?->importer ?? $exportRow?->shipper;

            $imports = (int) ($importRow?->imports ?? 0);
            $exports = (int) ($exportRow?->exports ?? 0);

            return [
                'client_id' => $clientId,
                'client_name' => $client?->name ?? 'Unknown',
                'client_type' => $client?->type ?? 'unknown',
                'imports' => $imports,
                'exports' => $exports,
                'total' => $imports + $exports,
            ];
        })->sortByDesc('total')->values();

        return response()->json([
            'year' => $year,
            'month' => $month ? (int) $month : null,
            'clients' => $rows,
        ]);
    }

    /**
     * Average turnaround times (days from created_at to updated_at for completed transactions).
     * GET /api/reports/turnaround?year=YYYY&month=MM
     */
    public function turnaround(Request $request)
    {
        $year = (int) $request->query('year', now()->year);
        $month = $request->query('month');

        $monthPad = $month ? str_pad((string) (int) $month, 2, '0', STR_PAD_LEFT) : null;

        // Import turnaround — JULIANDAY and strftime are both SQLite-native
        $importQuery = ImportTransaction::where('status', 'completed')
            ->whereRaw("strftime('%Y', created_at) = ?", [(string) $year])
            ->selectRaw('
                COUNT(*) as completed_count,
                AVG(JULIANDAY(updated_at) - JULIANDAY(created_at)) as avg_days,
                MIN(JULIANDAY(updated_at) - JULIANDAY(created_at)) as min_days,
                MAX(JULIANDAY(updated_at) - JULIANDAY(created_at)) as max_days
            ');

        if ($monthPad) {
            $importQuery->whereRaw("strftime('%m', created_at) = ?", [$monthPad]);
        }

        $importStats = $importQuery->first();

        // Export turnaround
        $exportQuery = ExportTransaction::where('status', 'completed')
            ->whereRaw("strftime('%Y', created_at) = ?", [(string) $year])
            ->selectRaw('
                COUNT(*) as completed_count,
                AVG(JULIANDAY(updated_at) - JULIANDAY(created_at)) as avg_days,
                MIN(JULIANDAY(updated_at) - JULIANDAY(created_at)) as min_days,
                MAX(JULIANDAY(updated_at) - JULIANDAY(created_at)) as max_days
            ');

        if ($monthPad) {
            $exportQuery->whereRaw("strftime('%m', created_at) = ?", [$monthPad]);
        }

        $exportStats = $exportQuery->first();

        $round = fn($v) => $v !== null ? round((float) $v, 1) : null;

        return response()->json([
            'year' => $year,
            'month' => $month ? (int) $month : null,
            'imports' => [
                'completed_count' => (int) ($importStats->completed_count ?? 0),
                'avg_days' => $round($importStats->avg_days ?? null),
                'min_days' => $round($importStats->min_days ?? null),
                'max_days' => $round($importStats->max_days ?? null),
            ],
            'exports' => [
                'completed_count' => (int) ($exportStats->completed_count ?? 0),
                'avg_days' => $round($exportStats->avg_days ?? null),
                'min_days' => $round($exportStats->min_days ?? null),
                'max_days' => $round($exportStats->max_days ?? null),
            ],
        ]);
    }
}
