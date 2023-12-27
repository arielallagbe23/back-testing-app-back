<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Actif extends Model
{
    use HasFactory;

    protected $table = "actifs";
    protected $fillable = ['nom_actif','type'];
    
}
