<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    public function index() 
    {
        return Blog::select('id','title', 'excerpt', 'description','image', 'created_at')->get();
    }

    public function store(Request $request) 
    {
        $data = $request->validate([
            'title' => 'required|max:250|min:5',
            'description' => 'required',
            'image'=>'required|image|max:2048'
        ]);

        try{
            if($request->file('image')) {
                $data['image'] = $request->file('image')->store('blog-images');
            } 

            $data['excerpt'] = Str::limit($data['description'], 150);

            Blog::create($data);

            return response()->json([
                'message'=> 'Blog Created Successfully'
            ]);

        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'message' => 'Something goes wrong while creating a blog'
            ], 500);
        }
    }
    public function show(Blog $blog) 
    {
        return response()->json([
            'blog' => $blog
        ]);
    }
    public function update(Request $request, Blog $blog) 
    {
        $data = $request->validate([
            'title' => 'required|max:250|min:5',
            'description' => 'required',
            'image'=>'required|max:2048'
        ]);

        try {
            if ($request->file('image')) {
                if ($request->oldImage) {
                    Storage::delete($request->oldImage);
                }
                $data['image'] = $request->file('image')->store('blog-images');
            }  

            Blog::where('id', $blog->id)
                ->update($data);

            return response()->json([
                'message' => 'Blog Updated Successfully!!'
            ]);    

        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'message' => 'Something goes wrong while updating a blog'
            ], 500);
        }
    }
    public function destroy(Blog $blog) 
    {
        try {
            if ($blog->image) {
                Storage::delete($blog->image);
            }
            
            Blog::destroy($blog->id);
            return response()->json([
                'message' => 'Blog Removed Successfully'
            ]);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'message' => 'Something goes wrong while deleting a blog'
            ]);
        }
    }
}
