<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suppliers = [
            [
                'name' => 'PT. Sumber Sejati',
                'contact_name' => 'Ucup',
                'email' => 'ucup@gmail.com',
                'phone' => '08942039203909',
                'address' => 'Jakarta',
                'status' => 'active',
            ],
            [
                'name' => 'CV. Jaya Abadi',
                'contact_name' => 'Budi',
                'email' => 'budi@gmail.com',
                'phone' => '081234567890',
                'address' => 'Bandung',
                'status' => 'active',
            ],
            [
                'name' => 'UD. Maju Mundur',
                'contact_name' => 'Siti',
                'email' => 'siti@gmail.com',
                'phone' => '081112223333',
                'address' => 'Surabaya',
                'status' => 'active',
            ]
        ];

        DB::table('suppliers')->insert($suppliers);
    }
}
