<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('trades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete('cascade')->onUpdate('cascade');
            $table->foreignId('actif_id')->constrained('actifs')->restrictOnDelete('cascade')->onUpdate('cascade');
            $table->foreignId('strategie_id')->constrained('strategies')->restrictOnDelete('cascade')->onUpdate('cascade');
            $table->foreignId('timeframe_id')->constrained('timeframes')->restrictOnDelete('cascade')->onUpdate('cascade');
            $table->datetime('date')->nullable();
            $table->datetime('date_entree')->nullable();
            $table->datetime('date_sortie')->nullable();
            $table->string('PE');
            $table->string('TP');
            $table->string('SL');
            $table->string('sens');
            $table->foreignId('type_ordre_id')->constrained('type_ordres')->restrictOnDelete('cascade')->onUpdate('cascade');
            $table->string('risque');
            $table->string('profit');
            $table->string('status')->default('cloturé');
            $table->string('resultats');
            $table->foreignId('situation_id')->constrained('situations')->restrictOnDelete('cascade')->onUpdate('cascade');
            $table->string('nb_pip_echap_PE')->nullable();
            $table->string('nb_pip_echap_TP')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trades');
    }
};
