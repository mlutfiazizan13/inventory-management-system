<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index() {

        $roles = Role::where('status', 'active')->get();
        return Inertia::render("roles/index", ["roles" => Inertia::always($roles)]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name"=> "required|unique:roles,name",
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $role = new Role();
        $role->name = $request->name;
        $role->save();
        
        return redirect()->back()->with('success', 'Role created successfully.');
    }

    public function update(Request $request, int $id)
    {

        $validator = Validator::make($request->all(), [
            "name"=> "required|unique:roles,name,".$id,
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $role = Role::find($id);

        if ($role == null) {
            return redirect()->back()->with("error", "Role not found");
        }
        $role->name = $request->name;
        $role->save();

        return redirect()->back()->with('success', 'Role updated successfully.');
    }

    public function delete(int $id) {
        $role = role::find($id);
        if ($role == null) {
            return redirect()->back()->with('error','Role not found');
        }
        
        $role->status = 'inactive';
        $role->save();

        return redirect()->back()->with('success','Role deleted successfully');
    }
}
