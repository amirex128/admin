<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\TagController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::group(['prefix' => 'auth'], function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);

    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::get('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);
    });
});

Route::group([
    'prefix' => 'article',
    'middleware' => 'auth:sanctum'
], function () {
    Route::get('/', [ArticleController::class, 'index']);
    Route::post('/', [ArticleController::class, 'store']);
    Route::get('/{article}', [ArticleController::class, 'show']);
    Route::post('/{article}', [ArticleController::class, 'update']);
    Route::delete('/{article}', [ArticleController::class, 'destroy']);
});
Route::group([
    'prefix' => 'page',
    'middleware' => 'auth:sanctum'
], function () {
    Route::get('/', [PageController::class, 'index']);
    Route::post('/', [PageController::class, 'store']);
    Route::get('/{page}', [PageController::class, 'show']);
    Route::post('/{page}', [PageController::class, 'update']);
    Route::delete('/{page}', [PageController::class, 'destroy']);
});
Route::group([
    'prefix' => 'category',
    'middleware' => 'auth:sanctum'
], function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::post('/', [CategoryController::class, 'store']);
    Route::get('/{category}', [CategoryController::class, 'show']);
    Route::post('/{category}', [CategoryController::class, 'update']);
    Route::delete('/{category}', [CategoryController::class, 'destroy']);
});
Route::group([
    'prefix' => 'tag',
    'middleware' => 'auth:sanctum'
], function () {
    Route::get('/', [TagController::class, 'index']);
    Route::post('/', [TagController::class, 'store']);
    Route::get('/{tag}', [TagController::class, 'show']);
    Route::post('/{tag}', [TagController::class, 'update']);
    Route::delete('/{tag}', [TagController::class, 'destroy']);
});
