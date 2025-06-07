<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index()
    {
        $suppliers = Supplier::where('status', 'active')->get();
        return Inertia::render("suppliers/index", ["suppliers" => Inertia::always($suppliers)]);
    }



    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            "name"=> "required",
            "contact_name"=> "nullable",
            "email"=> "nullable|email",
            "phone"=> "required",
            "address"=> "nullable",
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        

        // dd($request);

        $supplier = new Supplier();
        $supplier->name = $request->name;
        $supplier->contact_name = $request->contact_name;
        $supplier->email = $request->email;
        $supplier->phone = $request->phone;
        $supplier->address = $request->address;
        $supplier->save();

        return redirect()->back()->with('success', 'Supplier created successfully.');
    }

    public function update(Request $request, int $id)
    {
        $validator = Validator::make($request->all(), [
            "name"=> "required",
            "contact_name"=> "nullable",
            "email"=> "nullable|email",
            "phone"=> "required",
            "address"=> "nullable",
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $supplier = Supplier::find($id);

        if ($supplier == null) {
            return redirect()->back()->with("error","Supplier not found");
        }

        $supplier->name = $request->name;
        $supplier->contact_name = $request->contact_name;
        $supplier->email = $request->email;
        $supplier->phone = $request->phone;
        $supplier->address = $request->address;
        $supplier->save();

        return redirect()->back()->with('success', 'Supplier updated successfully.');
    }

    public function delete(int $id) {
        $supplier = Supplier::find($id);
        if ($supplier == null) {
            return redirect()->back()->with('error','Supplier not found');
        }

        $supplier->status = 'inactive';
        $supplier->save();

        return redirect()->back()->with('success','Supplier deleted successfully');
    }
}
