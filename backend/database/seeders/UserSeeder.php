<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name'     => 'Coordenador ADM',
                'password' => Hash::make('123456'),
                'role'     => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'amigo@teste.com'],
            [
                'name'     => 'Desafiante',
                'password' => Hash::make('123456'),
                'role'     => 'challenger',
            ]
        );
    }
}
