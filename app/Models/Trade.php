<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trade extends Model
{
    use HasFactory;

    protected $table = "trades";
    protected $fillable = [''];

    public static function calculateTotalProfit()
    {
        $totalProfit =   self::where('resultats', '=', 'TP')->sum('profit') +
                        self::where('resultats', '=', 'SL')->sum(\DB::raw('-risque'));
    
        return $totalProfit;
    }
    
    
}
