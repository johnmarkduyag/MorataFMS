<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Document extends Model
{
    protected $fillable = [
        'documentable_type',
        'documentable_id',
        'type',
        'filename',
        'path',
        'size_bytes',
        'version',
        'uploaded_by',
    ];

    protected $casts = [
        'size_bytes' => 'integer',
        'version' => 'integer',
    ];

    // Polymorphic relationship
    public function documentable(): MorphTo
    {
        return $this->morphTo();
    }

    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    // Helper to get human-readable file size
    public function getFormattedSizeAttribute(): string
    {
        $bytes = $this->size_bytes;
        if ($bytes < 1024)
            return $bytes . ' B';
        if ($bytes < 1048576)
            return round($bytes / 1024, 2) . ' KB';
        return round($bytes / 1048576, 2) . ' MB';
    }

    // Document type labels
    public static function getTypeLabels(): array
    {
        return [
            'invoice' => 'Invoice',
            'packing_list' => 'Packing List',
            'bl' => 'Bill of Lading',
            'co' => 'Certificate of Origin',
            'cil' => 'Certificate of Inspection & Loading',
            'phytosanitary' => 'Phytosanitary Certificate',
            'export_declaration' => 'Export Declaration',
            'import_entry' => 'Import Entry',
            'delivery_order' => 'Delivery Order',
            'other' => 'Other',
        ];
    }
}
