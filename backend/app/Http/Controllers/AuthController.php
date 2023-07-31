<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {   
        $data = $request->validate([
            'name' => 'required|max:250|min:3',
            'email' => 'required|email:dns|unique:users',
            'password' => 'required|min:5|max:255'
        ]);

        try {
            $data['password'] = Hash::make($data['password']);
    
            User::create($data);

            return response()->json([
                'message'=> 'Register Successfully'
            ]);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'message' => 'Something goes wrong while registering'
            ], 500);
        }

    }
    public function login(Request $request) 
    {
        $data = $request->validate([
            'email' => 'required|email:dns',
            'password' => 'required',
        ]);

        try {
            if (!$token = JWTAuth::attempt($data)) {
                return response()->json([
                    'message' => 'Login failed',
                ], 401);
            }

            return response()->json([
                'message' => 'Login successfully',
                'token' => $token
            ]);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'message' => 'Login failed'
            ], 500);
        }
    }
    public function logout()
    {   
        $removeToken = JWTAuth::invalidate(JWTAuth::getToken());

        if($removeToken) {
            return response()->json([
                'message' => 'Logout successfully',  
            ]);
        }
    }
}
