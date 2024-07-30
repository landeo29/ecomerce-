<?php

namespace App\Models;

use App\Models\Course\Course;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        "surname",
        'email',
        'password',

        "avatar",
        "role_id",

        "state",//1 es activo y 2 es desactivo
        "type_user",// 1 es de tipo cliente y 2 es de tipo admin
    
        "is_instructor",
        "profesion",
        "description"
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }
 
    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function courses()
    {
        return $this->hasMany(Course::class)->where("state",2);
    }

    public function getCoursesCountAttribute()
    {
        return $this->courses->count();
    }
    function scopeFilterAdvance($query,$search,$state)
    {
        if($search){
            $query->where("email","like","%".$search."%");
        }
        if($state){
            $query->where("state",$state);
        }
        
        return $query;
    }
}
