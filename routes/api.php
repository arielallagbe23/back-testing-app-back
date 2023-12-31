<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UserController;
use App\Http\Controllers\ApiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('register', [UserController::class,'register']);

Route::post('login', [UserController::class,'login']);

Route::middleware('auth:sanctum')->group(function() {

    Route::get('user', [UserController::class,'user']);

    Route::post('logout', [UserController::class,'logout']);

    Route::get('all-Trades', [UserController::class,'allTrades']);

    Route::post('create-trade', [UserController::class,'createTrade']);

});

Route::get('all-Actifs', [UserController::class,'allActifs']);

Route::post('add-Actif',[UserController::class,'addActif']);

Route::get('all-Situations', [UserController::class,'allSituations']);

Route::get('all-Strategies', [UserController::class,'allStrategies']);

Route::post('add-Strategie',[UserController::class,'addStrategie']);

Route::get('all-timeframes', [UserController::class,'allTimeframes']);

Route::post('add-Timframe',[UserController::class,'addTimeframes']);

Route::get('all-type-ordres', [UserController::class,'allTypeOrdres']);

Route::post('add-type-ordres',[UserController::class,'addTypeOrdre']);

Route::get('total-profit',[UserController::class,'getTotalProfit']);






