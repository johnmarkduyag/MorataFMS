<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('import_stages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('import_transaction_id')->constrained()->cascadeOnDelete();

            // BOC Stage
            $table->enum('boc_status', ['pending', 'in_progress', 'completed'])->default('pending');
            $table->timestamp('boc_completed_at')->nullable();
            $table->foreignId('boc_completed_by')->nullable()->constrained('users')->nullOnDelete();

            // PPA Stage
            $table->enum('ppa_status', ['pending', 'in_progress', 'completed'])->default('pending');
            $table->timestamp('ppa_completed_at')->nullable();
            $table->foreignId('ppa_completed_by')->nullable()->constrained('users')->nullOnDelete();

            // DO (Delivery Order) Stage
            $table->enum('do_status', ['pending', 'in_progress', 'completed'])->default('pending');
            $table->timestamp('do_completed_at')->nullable();
            $table->foreignId('do_completed_by')->nullable()->constrained('users')->nullOnDelete();

            // Port Charges Stage
            $table->enum('port_charges_status', ['pending', 'in_progress', 'completed'])->default('pending');
            $table->timestamp('port_charges_completed_at')->nullable();
            $table->foreignId('port_charges_completed_by')->nullable()->constrained('users')->nullOnDelete();

            // Releasing Stage
            $table->enum('releasing_status', ['pending', 'in_progress', 'completed'])->default('pending');
            $table->timestamp('releasing_completed_at')->nullable();
            $table->foreignId('releasing_completed_by')->nullable()->constrained('users')->nullOnDelete();

            // Billing & Liquidation Stage
            $table->enum('billing_status', ['pending', 'in_progress', 'completed'])->default('pending');
            $table->timestamp('billing_completed_at')->nullable();
            $table->foreignId('billing_completed_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('import_stages');
    }
};
