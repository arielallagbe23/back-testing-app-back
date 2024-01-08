<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trade extends Model
{
    use HasFactory;

    protected $table = "trades";
    protected $fillable = [
        'user_id',
        'actif_id',
        'strategie_id',
        'timeframe_id',
        'date',
        'date_entree',
        'date_sortie',
        'PE',
        'TP',
        'SL',
        'sens',
        'type_ordre_id',
        'risque',
        'profit',
        'status',
        'resultats',
        'situation_id',
        'nb_pip_echap_PE',
        'nb_pip_echap_TP',
    ];
    



    public static function calculateTotalProfit($userId)
    {
        $totalProfit = self::where('user_id', $userId)
            ->where(function ($query) {
                $query->where('resultats', '=', 'TP')
                    ->orWhere('resultats', '=', 'SL');
            })
            ->sum('profit') + self::where('user_id', $userId)
            ->where('resultats', '=', 'SL')
            ->sum(\DB::raw('-risque'));

        return $totalProfit;
    }

    
    
}
