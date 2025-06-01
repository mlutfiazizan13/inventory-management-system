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
                "name"=> "Shoes"
            ],
            [
                "id" => "RUN",
                "name"=> "Running Shoes"
            ],
            [
                "id" => "CAS",
                "name"=> "Casual Shoes"
            ],
            [
                "id" => "FRM",
                "name"=> "Formal Shoes"
            ],
            [
                "id" => "SPT",
                "name"=> "Sports Shoes"
            ],
            [
                "id" => "SNK",
                "name"=> "Sneakers"
            ],
            [
                "id" => "SDL",
                "name"=> "Sandals / Slippers"
            ]];

        Category::insert($category);


        $brands = [[
                "id" => "NIK",
                "name"=> "Nike"
            ],
            [
                "id" => "ADI",
                "name"=> "Adidas"
            ],
            [
                "id" => "PUM",
                "name"=> "Puma"
            ],
            [
                "id" => "REE",
                "name"=> "Reebok"
            ],
            [
                "id" => "NWB",
                "name"=> "New Balance"
            ],
            [
                "id" => "VNS",
                "name"=> "Vans"
            ],
            [
                "id" => "SKC",
                "name"=> "Skechers"
            ]
        ];
        Brand::insert($brands);
    }
}
