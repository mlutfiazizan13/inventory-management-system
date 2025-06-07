<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function index() {

        $users = User::where('status', 'active')->with('roles')->get();
        $roles = Role::select('id', 'name')->where('status', 'active')->get();
        return Inertia::render("users/index", ["users"=> $users, "roles" => $roles]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name"=> "required",
            "email" => "required|email|unique:users,email",
            "role_id" => "required",
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->save();
        
        $user->roles()->attach($request->role_id);
        
        return redirect()->back()->with('success', 'User created successfully.');
    }

    public function update(Request $request, int $id)
    {
        $validator = Validator::make($request->all(), [
            "name"=> "required",
            "email" => "required|email|unique:users,email,".$id,
            "role_id" => "required",
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $user = User::find($id);

        if ($user == null) {
            return redirect()->back()->with("error", "User not found");
        }
        $user->name = $request->name;
        $user->email = $request->email;
        $user->save();

        $user->roles()->detach();
        $user->roles()->attach($request->role_id);

        return redirect()->back()->with('success', 'User updated successfully.');
    }

    public function delete(int $id) {
        $user = User::find($id);
        if ($user == null) {
            return redirect()->back()->with('error','User not found');
        }

        $user->status = 'inactive';
        $user->save();

        return redirect()->back()->with('success','User deleted successfully');
    }
}
