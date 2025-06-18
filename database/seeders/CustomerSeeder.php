<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('customers')->insert([
            [
                'name'       => 'PT. Sinar Abadi',
                'email'      => 'contact@sinarabadi.co.id',
                'phone'      => '021-5678901',
                'address'    => 'Jl. Gatot Subroto No. 23, Jakarta Selatan',
                'status'     => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name'       => 'CV. Maju Bersama',
                'email'      => 'admin@majubersama.com',
                'phone'      => '031-2345678',
                'address'    => 'Jl. Darmo Indah No. 10, Surabaya',
                'status'     => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name'       => 'PT. Solusi Digital',
                'email'      => 'info@solusidigital.net',
                'phone'      => '022-88889999',
                'address'    => 'Jl. Soekarno Hatta No. 99, Bandung',
                'status'     => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
