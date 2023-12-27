<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Strategie extends Model
{
    use HasFactory;

    protected $table = "startegies";
    protected $fillable = ['nom_strategie','contenu'];
    
}
