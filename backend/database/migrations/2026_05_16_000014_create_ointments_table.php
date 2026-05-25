<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('ointments', function (Blueprint $table) {
            $table->id();
            $table->string('ointment_name');
            $table->string('type')->nullable();
            $table->integer('stock')->default(0);
            $table->date('expiry_date')->nullable();
            $table->string('manufacturer')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('ointments');
    }
};
