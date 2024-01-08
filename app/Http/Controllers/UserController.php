<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Trade;
use App\Models\Actif;
use App\Models\Situation;
use App\Models\Strategie;
use App\Models\Timeframe;
use App\Models\TypeOrdre;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use Carbon\Carbon;



class UserController extends Controller
{
    
    public function register(Request $request)
    {
        return User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password'))
        ]);
    }

    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('email','password'))) 
        {
            return response([
                'message' => 'Invalid crédentials !'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $user = Auth::user();

        $token = $user->createToken('token')->plainTextToken;

        $cookie = cookie('jwt', $token, 60 * 24); // 1 day token
        
        return response([
            'message' => 'Login successful!',
            'token' => $token
        ])->withCookie($cookie);
    }

    public function user()
    {
        $user = auth()->user();
    
        if ($user) {

            $actifsSpecifiques = ['AUDUSD', 'EURUSD', 'GBPUSD', 'NZDUSD', 'USDCAD', 'USDCHF', 'AUDCAD', 'AUDCHF', 'CADCHF', 'EURAUD', 'EURCAD', 'EURGBP', 'EURNZD', 'GBPAUD', 'GBPCAD', 'GBPCHF', 'NZDCAD'];

            $graphData = DB::table('trades')
            ->join('actifs', 'trades.actif_id', '=', 'actifs.id')
            ->join('timeframes', 'trades.timeframe_id', '=', 'timeframes.id')
            ->join('type_ordres', 'trades.type_ordre_id', '=', 'type_ordres.id')
            ->where('trades.user_id', $user->id)
            ->where('trades.resultats', 'TP')
            ->whereIn('actifs.nom_actif', $actifsSpecifiques)
            ->select('trades.date_entree', 'actifs.nom_actif as actif', 'timeframes.timeframe as timeframe', 'type_ordres.type_ordre as type_ordre', 'trades.PE', 'trades.resultats')
            ->get();
    
            return response()->json(['user' => $user, 'graphData' => $graphData]);
        } else {
            return response()->json(['message' => 'Utilisateur non authentifié'], 401);
        }
    }


    public function logout (Request $request) 
    {
        $request->user()->tokens->each(function ($token) {
            $token->delete();
        });
    
        return response()->json(['message' => 'Déconnexion réussie']);
    }

    public function allTrades()
    {
        $user = Auth::user();
    
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non authentifié'], 401);
        }
    
            $trades = DB::table('trades')
                ->join('actifs', 'trades.actif_id', '=', 'actifs.id')
                ->join('type_ordres', 'trades.type_ordre_id', '=', 'type_ordres.id')
                ->join('timeframes', 'trades.timeframe_id', '=', 'timeframes.id')
                ->join('situations', 'trades.situation_id', '=', 'situations.id')
                ->select('trades.*', 'actifs.nom_actif', 'type_ordres.type_ordre', 'timeframes.timeframe', 'situations.type_situation')
                ->orderBy('id', 'desc')
                ->where('trades.user_id', $user->id)
                ->get();


        if ($trades->isEmpty()) {
            return response()->json(['message' => 'Aucun trade trouvé pour cet utilisateur'], 404);
        }
    
        return response()->json($trades);
    }

    public function allActifs()
    {
        $actifs = DB::table('actifs')->get();

        return response()->json($actifs);
    }

    public function allSituations()
    {
        $situations = DB::table('situations')->get();

        return response()->json($situations);
    }

    public function allStrategies()
    {
        $strategies = DB::table('strategies')->get();

        return response()->json($strategies);
    }

    public function allTimeframes()
    {
        $timeframes = DB::table('timeframes')->get();

        return response()->json($timeframes);
    }

    public function allTypeOrdres()
    {
        $typeordres = DB::table('type_ordres')->get();

        return response()->json($typeordres);
    }


    public function createTrade (Request $request)
    {
        $user = Auth()->user();

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non authentifié'], 401);
        }

        if ($user) {

            $trade = new Trade;

            $trade->user_id = $user->id;
            $trade->actif_id = $request->input('actif_id');
            $trade->strategie_id = $request->input('strategie_id');
            $trade->timeframe_id = $request->input('timeframe_id');
            $trade->date = Carbon::now();
            $trade->date_entree = $request->input('date_entree');
            $trade->date_sortie = $request->input('date_sortie');
            $trade->PE = $request->input('PE');
            $trade->TP = $request->input('TP');
            $trade->SL = $request->input('SL');
            $trade->sens = $request->input('sens');
            $trade->type_ordre_id = $request->input('type_ordre_id');
            $trade->risque = $request->input('risque');
            $trade->profit = $request->input('profit');
            $trade->status = $request->input('status', 'cloturé');
            $trade->resultats = $request->input('resultats');
            $trade->situation_id = $request->input('situation_id');
            $trade->nb_pip_echap_PE = $request->input('nb_pip_echap_PE');
            $trade->nb_pip_echap_TP = $request->input('nb_pip_echap_TP');

            $trade->save();

            if ($trade->exists) {
                return response()->json(['message' => 'Trade créé avec succès', 'trade' => $trade], 201);
            } else {
                return response()->json(['message' => 'Erreur lors de la création du trade'], 500);
            }
        }
    }


    public function addActif(Request $request)
    {
        $actifsData = $request->json()->all();
    
        foreach ($actifsData as $actifData) {
            $actif = new Actif;
            $actif->nom_actif = $actifData['nom_actif'];
            $actif->type_actifs_id = $actifData['type_actifs_id'];
            $actif->user_id = $actifData['user_id'];
            $actif->save();
        }
    
        return response()->json(['message' => 'Actifs ajoutés avec succès']);
    }


    public function addTimeframes(Request $request)
    {
        $timeframesData = $request->json()->all();

        foreach ($timeframesData as $timeframeData) {
            $timeframe = new Timeframe;
            $timeframe->timeframe = $timeframeData['timeframe'];
            $timeframe->save();
        }

        return response()->json(['message' => 'Timeframes ajoutés avec succès']);
    }

    public function addStrategie(Request $request)
    {
        $strategiesData = $request->json()->all();

        foreach ($strategiesData as $strategieData) {
            $strategie = new Strategie;
            $strategie->nom_strategie = $strategieData['nom_strategie'];
            $strategie->contenu = $strategieData['contenu'];
            $strategie->save();
        }

        return response()->json(['message' => 'Stratégies ajoutées avec succès']);
    }

    public function addTypeOrdre(Request $request)
    {
        $typeOrdresData = $request->json()->all();

        foreach ($typeOrdresData as $typeOrdreData) {
            $typeOrdre = new TypeOrdre;
            $typeOrdre->type_ordre = $typeOrdreData['type_ordre'];
            $typeOrdre->save();
        }

        return response()->json(['message' => 'Types d\'ordres ajoutés avec succès']);
    }

    public function getTotalProfit()
    {
        try {
            $user = Auth::user();
    
            if (!$user) {
                return response()->json(['message' => 'Utilisateur non authentifié'], 401);
            }
    
            $totalProfit = $user->trades()->sum(function ($trade) {
                if ($trade->resultats === 'SL') {
                    // Soustraire le risque si le résultat est 'SL'
                    return -$trade->risque;
                } elseif ($trade->resultats === 'TP') {
                    // Ajouter le profit si le résultat est 'TP'
                    return $trade->profit;
                }
    
                // Aucun ajustement si le résultat n'est ni 'SL' ni 'TP'
                return 0;
            });
    
            return response()->json(['totalProfit' => $totalProfit], 200);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Erreur lors de la récupération des profits'], 500);
        }
    }
    
    

    

}
