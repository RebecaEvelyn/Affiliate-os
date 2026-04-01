<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user    = $request->user();
        $company = $user->company;

        $totalAffiliates = $company->users()
            ->where('role', 'affiliate')
            ->count();

        $activeAffiliates = $company->users()
            ->where('role', 'affiliate')
            ->where('active', true)
            ->count();

        return Inertia::render('Admin/Dashboard', [
            'company'          => $company,
            'totalAffiliates'  => $totalAffiliates,
            'activeAffiliates' => $activeAffiliates,
        ]);
    }
}