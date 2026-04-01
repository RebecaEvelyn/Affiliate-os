<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class OwnerSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'owner@saas.com'],
            [
                'name'     => 'Owner',
                'password' => Hash::make('password'),
                'role'     => 'owner',
            ]
        );
    }
}