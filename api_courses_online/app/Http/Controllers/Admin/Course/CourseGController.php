<?php

namespace App\Http\Controllers\Admin\Course;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Course\Course;
use App\Models\Course\Categorie;
use Owenoj\LaravelGetId3\GetId3;
use Vimeo\Laravel\Facades\Vimeo;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\Course\CourseGResource;
use App\Http\Resources\Course\CourseGCollection;

class CourseGController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $state = $request->state;

        // filterAdvance($search,$state)->
        $courses = Course::filterAdvance($search,$state)->orderBy("id","desc")->get();

        return response()->json([
            "courses" => CourseGCollection::make($courses),
        ]);
    }

    public function config()
    {
        $categories = Categorie::where("categorie_id",NULL)->orderBy("id","desc")->get();
        $subcategories = Categorie::where("categorie_id","<>",NULL)->orderBy("id","desc")->get();
    
        $instructores = User::where("is_instructor",1)->orderBy("id","desc")->get();
        return response()->json([
            "categories" => $categories,
            "subcategories" => $subcategories,
        
            "instructores" => $instructores->map(function($user){
                return [
                    "id" => $user->id,
                    "full_name" => $user->name.' '.$user->surname,
                ];
            }),
        ]);
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $is_exits = Course::where("title",$request->title)->first();
        if($is_exits){
            return response()->json(["message" => 403,"message_text" => "YA EXISTE UN CURSO CON ESTE TITULO"]);
        }
        if($request->hasFile("portada")){
            $path = Storage::putFile("courses",$request->file("portada"));
            $request->request->add(["imagen" => $path]);
        }
        $request->request->add(["slug" => Str::slug($request->title)]);
        $request->request->add(["requirements" => json_encode(explode(",",$request->requirements))]);
        $request->request->add(["who_is_it_for" => json_encode(explode(",",$request->who_is_it_for))]);
        $course = Course::create($request->all());
        // "course" => CourseGResource::make($course)
        return response()->json(["message" => 200]);
    }

    public function upload_video(Request $request,$id)
    {
        $time = 0;
        
        //instantiate class with file
        $track = new GetId3($request->file('video'));

        //get playtime
        $time = $track->getPlaytimeSeconds();

        $response = Vimeo::upload($request->file('video'));


        $course = Course::findOrFail($id);
        error_log(json_encode(explode("/",$response)));
        $vimeo_id = explode("/",$response)[2];

        $course->update(["vimeo_id" => $vimeo_id,"time" => date("H:i:s",$time)]);

        return response()->json([
            "link_video" => "https://player.vimeo.com/video/".$vimeo_id,
        ]);
    }
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $course = Course::findOrFail($id);

        return response()->json([
            "course" => CourseGResource::make($course),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $is_exits = Course::where("id","<>",$id)->where("title",$request->title)->first();
        if($is_exits){
            return response()->json(["message" => 403,"message_text" => "YA EXISTE UN CURSO CON ESTE TITULO"]);
        }
        $course = Course::findOrFail($id);
        if($request->hasFile("portada")){
            if($course->imagen){
                Storage::delete($course->imagen);
            }
            $path = Storage::putFile("courses",$request->file("portada"));
            $request->request->add(["imagen" => $path]);
        }
        $request->request->add(["slug" => Str::slug($request->title)]);
        $request->request->add(["requirements" => json_encode(explode(",",$request->requirements))]);
        $request->request->add(["who_is_it_for" => json_encode(explode(",",$request->who_is_it_for))]);
        $course->update($request->all());

        return response()->json(["course" => CourseGResource::make($course)]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $course->delete();
        return response()->json(["message" => 200]);
    }
}
