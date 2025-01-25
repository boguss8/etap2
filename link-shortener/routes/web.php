<?php

use App\Http\Controllers\LinkController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/links', [LinkController::class, 'store']);

Route::get('/{shortUrl}', [LinkController::class, 'redirect']);
