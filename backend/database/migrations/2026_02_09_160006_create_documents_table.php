<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();

            // Polymorphic relationship to ImportTransaction or ExportTransaction
            $table->morphs('documentable');

            // Document info
            $table->string('type', 50); // invoice, packing_list, bl, co, cil, phytosanitary, etc.
            $table->string('filename', 255);
            $table->string('path', 500);
            $table->unsignedInteger('size_bytes')->nullable();
            $table->unsignedInteger('version')->default(1);

            // Tracking
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            // Index for efficient document lookups by type
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
