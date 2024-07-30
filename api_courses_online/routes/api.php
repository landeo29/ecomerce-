<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Tienda\HomeController;
use App\Http\Controllers\Admin\Coupon\CouponController;
use App\Http\Controllers\Admin\Course\ClaseGController;
use App\Http\Controllers\Admin\Course\CourseGController;
use App\Http\Controllers\Admin\Course\SeccionGController;
use App\Http\Controllers\Admin\Course\CategorieController;
use App\Http\Controllers\Admin\Discount\DiscountController;

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

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/login_tienda', [AuthController::class, 'login_tienda']);
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::post('/refresh', [AuthController::class, 'refresh'])->name('refresh');
    Route::post('/me', [AuthController::class, 'me'])->name('me');
});
Route::group([
    'middleware' => 'api',
], function ($router) {
    Route::resource('/users',UserController::class);
    Route::post('/users/{id}',[UserController::class, "update"]);
    // 
    Route::resource('/categorie',CategorieController::class);
    Route::post('/categorie/{id}',[CategorieController::class, "update"]);

    // 
    Route::get('/course/config',[CourseGController::class, "config"]);
    Route::resource('/course',CourseGController::class);
    Route::post('/course/upload_video/{id}',[CourseGController::class, "upload_video"]);
    Route::post('/course/{id}',[CourseGController::class, "update"]);

    Route::resource('/course-section',SeccionGController::class);

    Route::resource('/course-clases',ClaseGController::class);
    Route::post('/course-clases-file',[ClaseGController::class, "addFiles"]);
    Route::delete('/course-clases-file/{id}',[ClaseGController::class, "removeFiles"]);
    Route::post('/course-clases/upload_video/{id}',[ClaseGController::class, "upload_video"]);

    Route::get('/coupon/config',[CouponController::class, "config"]);
    Route::resource('/coupon',CouponController::class);

    Route::resource('/discount',DiscountController::class);
});

Route::group(["prefix" => "ecommerce"],function($router){
    Route::get("home",[HomeController::class,"home"]);
    Route::get("course-detail/{slug}",[HomeController::class,"course_detail"]);
});