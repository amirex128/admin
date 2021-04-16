<?php

use App\Http\Controllers\AuthController;
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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/user-profile', [AuthController::class, 'userProfile']);
});

Route::group([
    'middleware' => ['api', 'role:super_admin'],
    'prefix' => 'admin'

], function ($router) {
    Route::post('/register', [AuthController::class, 'adminRegister']);
});

Route::group([
    'prefix' => 'article',
    'middleware' => 'auth'
], function () {
    Route::get('/','ArticleController@index');
    Route::post('/','ArticleController@store');
    Route::get('/{article}','ArticleController@show');
    Route::post('/{article}','ArticleController@update');
    Route::delete('/{article}','ArticleController@destroy');
});
Route::group([
    'prefix' => 'page',
    'middleware' => 'auth'
], function () {
    Route::get('/','PageController@index');
    Route::post('/','PageController@store');
    Route::get('/{page}','PageController@show');
    Route::post('/{page}','PageController@update');
    Route::delete('/{page}','PageController@destroy');
});
Route::group([
    'prefix' => 'category',
    'middleware' => 'auth'
], function () {
    Route::get('/','CategoryController@index');
    Route::post('/','CategoryController@store');
    Route::get('/{category}','CategoryController@show');
    Route::post('/{category}','CategoryController@update');
    Route::delete('/{category}','CategoryController@destroy');
});
Route::group([
    'prefix' => 'tag',
    'middleware' => 'auth'
], function () {
    Route::get('/','TagController@index');
    Route::post('/','TagController@store');
    Route::get('/{tag}','TagController@show');
    Route::post('/{tag}','TagController@update');
    Route::delete('/{tag}','TagController@destroy');
});
