<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class AffiliateController extends Controller
{
    public function index(Request $request): Response
    {
        $affiliates = $request->user()->company
            ->users()
            ->where('role', 'affiliate')
            ->latest()
            ->get();

        return Inertia::render('Admin/Affiliates/Index', [
            'affiliates' => $affiliates,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Affiliates/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'           => ['required', 'string', 'max:255'],
            'email'          => ['required', 'email', 'max:255', 'unique:users,email'],
            'password'       => ['required', 'confirmed', Rules\Password::defaults()],
            'affiliate_code' => ['nullable', 'string', 'max:50', 'alpha_dash'],
        ]);

        if (!empty($validated['affiliate_code'])) {
            $exists = User::where('company_id', $request->user()->company_id)
                ->where('affiliate_code', strtoupper($validated['affiliate_code']))
                ->exists();

            if ($exists) {
                return back()->withErrors(['affiliate_code' => 'Este código já está a ser usado por outro afiliado.']);
            }
        }

        User::create([
            'name'           => $validated['name'],
            'email'          => $validated['email'],
            'password'       => Hash::make($validated['password']),
            'role'           => 'affiliate',
            'active'         => true,
            'company_id'     => $request->user()->company_id,
            'affiliate_code' => !empty($validated['affiliate_code']) ? strtoupper($validated['affiliate_code']) : null,
        ]);

        return redirect()->route('admin.affiliates.index')
            ->with('success', 'Afiliado criado com sucesso!');
    }

    public function edit(Request $request, User $affiliate): Response
    {
        if ($affiliate->company_id !== $request->user()->company_id) {
            abort(403);
        }

        return Inertia::render('Admin/Affiliates/Edit', [
            'affiliate' => $affiliate,
        ]);
    }

    public function update(Request $request, User $affiliate)
    {
        if ($affiliate->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $validated = $request->validate([
            'name'           => ['required', 'string', 'max:255'],
            'email'          => ['required', 'email', 'max:255', 'unique:users,email,' . $affiliate->id],
            'password'       => ['nullable', 'confirmed', Rules\Password::defaults()],
            'affiliate_code' => ['nullable', 'string', 'max:50', 'alpha_dash'],
        ]);

        if (!empty($validated['affiliate_code'])) {
            $exists = User::where('company_id', $request->user()->company_id)
                ->where('affiliate_code', strtoupper($validated['affiliate_code']))
                ->where('id', '!=', $affiliate->id)
                ->exists();

            if ($exists) {
                return back()->withErrors(['affiliate_code' => 'Este código já está a ser usado por outro afiliado.']);
            }
        }

        $data = [
            'name'           => $validated['name'],
            'email'          => $validated['email'],
            'affiliate_code' => !empty($validated['affiliate_code']) ? strtoupper($validated['affiliate_code']) : null,
        ];

        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        $affiliate->update($data);

        return redirect()->route('admin.affiliates.index')
            ->with('success', 'Afiliado atualizado com sucesso!');
    }

    public function toggleActive(Request $request, User $affiliate)
    {
        if ($affiliate->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $affiliate->update(['active' => ! $affiliate->active]);

        $status = $affiliate->active ? 'ativado' : 'desativado';

        return redirect()->route('admin.affiliates.index')
            ->with('success', "Afiliado {$status} com sucesso!");
    }

    public function destroy(Request $request, User $affiliate)
    {
        if ($affiliate->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $affiliate->delete();

        return redirect()->route('admin.affiliates.index')
            ->with('success', 'Afiliado removido com sucesso!');
    }
}