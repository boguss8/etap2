<?php

use App\Http\Controllers\LinkController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/links', [LinkController::class, 'index']);
Route::post('/links', [LinkController::class, 'store']);

Route::get('/{shortUrl}', [LinkController::class, 'redirect']);
