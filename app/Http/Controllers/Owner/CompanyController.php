<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function index(): Response
    {
        $companies = Company::with('users')->latest()->get();

        return Inertia::render('Owner/Companies/Index', [
            'companies' => $companies,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Owner/Companies/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name'   => ['required', 'string', 'max:255'],
            'company_email'  => ['required', 'email', 'max:255', 'unique:companies,email'],
            'admin_name'     => ['required', 'string', 'max:255'],
            'admin_email'    => ['required', 'email', 'max:255', 'unique:users,email'],
            'admin_password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Cria empresa com API Key gerada automaticamente
        $company = Company::create([
            'name'    => $validated['company_name'],
            'email'   => $validated['company_email'],
            'api_key' => Company::generateApiKey(),
        ]);

        // Cria o admin vinculado à empresa
        User::create([
            'name'       => $validated['admin_name'],
            'email'      => $validated['admin_email'],
            'password'   => Hash::make($validated['admin_password']),
            'role'       => 'admin',
            'company_id' => $company->id,
        ]);

        return redirect()->route('owner.companies.index')
            ->with('success', 'Empresa e admin criados com sucesso!');
    }

    public function show(Company $company): Response
    {
        $company->load('users');

        $admin      = $company->users->firstWhere('role', 'admin');
        $affiliates = $company->users->where('role', 'affiliate')->values();

        return Inertia::render('Owner/Companies/Show', [
            'company'    => $company,
            'admin'      => $admin,
            'affiliates' => $affiliates,
        ]);
    }

    public function edit(Company $company): Response
    {
        $company->load('users');

        $admin = $company->users->firstWhere('role', 'admin');

        return Inertia::render('Owner/Companies/Edit', [
            'company' => $company,
            'admin'   => $admin,
        ]);
    }

    public function update(Request $request, Company $company)
    {
        $company->load('users');

        $admin = $company->users->firstWhere('role', 'admin');

        $validated = $request->validate([
            'company_name'   => ['required', 'string', 'max:255'],
            'company_email'  => ['required', 'email', 'max:255', 'unique:companies,email,' . $company->id],
            'admin_name'     => ['required', 'string', 'max:255'],
            'admin_email'    => ['required', 'email', 'max:255', 'unique:users,email,' . ($admin?->id ?? 'NULL')],
            'admin_password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        $company->update([
            'name'  => $validated['company_name'],
            'email' => $validated['company_email'],
        ]);

        if ($admin) {
            $adminData = [
                'name'  => $validated['admin_name'],
                'email' => $validated['admin_email'],
            ];

            if (!empty($validated['admin_password'])) {
                $adminData['password'] = Hash::make($validated['admin_password']);
            }

            $admin->update($adminData);
        }

        return redirect()->route('owner.companies.index')
            ->with('success', 'Empresa atualizada com sucesso!');
    }

    public function destroy(Company $company)
    {
        $company->users()->delete();
        $company->delete();

        return redirect()->route('owner.companies.index')
            ->with('success', 'Empresa deletada com sucesso!');
    }

    public function toggleActive(Company $company)
    {
        $company->update(['active' => ! $company->active]);

        $status = $company->active ? 'ativada' : 'desativada';

        return redirect()->route('owner.companies.index')
            ->with('success', "Empresa {$status} com sucesso!");
    }

    public function swapAdmin(Request $request, Company $company)
    {
        $validated = $request->validate([
            'admin_name'     => ['required', 'string', 'max:255'],
            'admin_email'    => ['required', 'email', 'max:255', 'unique:users,email'],
            'admin_password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $company->users()
            ->where('role', 'admin')
            ->update(['role' => 'affiliate']);

        User::create([
            'name'       => $validated['admin_name'],
            'email'      => $validated['admin_email'],
            'password'   => Hash::make($validated['admin_password']),
            'role'       => 'admin',
            'company_id' => $company->id,
        ]);

        return redirect()->route('owner.companies.show', $company->id)
            ->with('success', 'Admin trocado com sucesso!');
    }

    // Regenera a API Key da empresa
    public function regenerateApiKey(Company $company)
    {
        $company->regenerateApiKey();

        return redirect()->route('owner.companies.show', $company->id)
            ->with('success', 'API Key regenerada com sucesso!');
    }
}