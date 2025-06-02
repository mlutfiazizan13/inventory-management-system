<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $category =[
            [
                "id" => "SHO",
                "name"=> "Shoes",
                "status"=> "active"
            ],
            [
                "id" => "RUN",
                "name"=> "Running Shoes",
                "status"=> "active"
            ],
            [
                "id" => "CAS",
                "name"=> "Casual Shoes",
                "status"=> "active"
            ],
            [
                "id" => "FRM",
                "name"=> "Formal Shoes",
                "status"=> "active"
            ],
            [
                "id" => "SPT",
                "name"=> "Sports Shoes",
                "status"=> "active"
            ],
            [
                "id" => "SNK",
                "name"=> "Sneakers",
                "status"=> "active"
            ],
            [
                "id" => "SDL",
                "name"=> "Sandals / Slippers",
                "status"=> "active"
            ]];

        Category::insert($category);


        $brands = [[
                "id" => "NIK",
                "name"=> "Nike",
                "status"=> "active"
            ],
            [
                "id" => "ADI",
                "name"=> "Adidas",
                "status"=> "active"
            ],
            [
                "id" => "PUM",
                "name"=> "Puma",
                "status"=> "active"
            ],
            [
                "id" => "REE",
                "name"=> "Reebok",
                "status"=> "active"
            ],
            [
                "id" => "NWB",
                "name"=> "New Balance",
                "status"=> "active"
            ],
            [
                "id" => "VNS",
                "name"=> "Vans",
                "status"=> "active"
            ],
            [
                "id" => "SKC",
                "name"=> "Skechers",
                "status"=> "active"
            ]
        ];
        Brand::insert($brands);
    }
}
