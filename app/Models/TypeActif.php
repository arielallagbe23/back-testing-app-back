<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeActif extends Model
{
    use HasFactory;

    protected $table = "type_actifs";
    protected $fillable = ['nom_type'];
}
