<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeOrdre extends Model
{
    use HasFactory;

    protected $table = "type_ordres";
    protected $fillable = ['type_ordre'];
    
}
