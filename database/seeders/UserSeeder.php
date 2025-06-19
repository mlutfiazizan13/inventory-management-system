<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::create([
            'name' => 'Muhamad Lutfi Azizan',
            'email' => 'mlutfiazizan@gmail.com',
            'password' => Hash::make('p@ssw0rd')
        ]);
        $user->roles()->attach(1);

        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@test.com',
            'password' => Hash::make('p@ssw0rd')
        ]);
        $admin->roles()->attach(1);

        $im = User::create([
            'name' => 'Inventory Manager',
            'email' => 'im@test.com',
            'password' => Hash::make('p@ssw0rd')
        ]);
        $im->roles()->attach(2);

        $ws = User::create([
            'name' => 'Warehouse Staff',
            'email' => 'ws@test.com',
            'password' => Hash::make('p@ssw0rd')
        ]);
        $ws->roles()->attach(3);

        $sales = User::create([
            'name' => 'Sales',
            'email' => 'sales@test.com',
            'password' => Hash::make('p@ssw0rd')
        ]);
        $sales->roles()->attach(4);

        $ps = User::create([
            'name' => 'Purchasing Staff',
            'email' => 'ps@test.com',
            'password' => Hash::make('p@ssw0rd')
        ]);
        $ps->roles()->attach(5);
    }
}
