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
    }
}
