<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CouponController extends Controller
{
    public function index(Request $request): Response
    {
        $coupons = Coupon::with('affiliate')
            ->where('company_id', $request->user()->company_id)
            ->latest()
            ->get();

        return Inertia::render('Admin/Coupons/Index', [
            'coupons' => $coupons,
        ]);
    }

    public function create(Request $request): Response
    {
        $affiliates = $request->user()->company
            ->users()
            ->where('role', 'affiliate')
            ->where('active', true)
            ->get(['id', 'name', 'email']);

        return Inertia::render('Admin/Coupons/Create', [
            'affiliates' => $affiliates,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'affiliate_id'        => ['required', 'exists:users,id'],
            'code'                => ['required', 'string', 'max:255', 'unique:coupons,code'],
            'discount_percentage' => ['nullable', 'numeric', 'min:0.01', 'max:100'],
            'free_shipping'       => ['boolean'],
            'expires_at'          => ['nullable', 'date', 'after:today'],
            'usage_limit'         => ['nullable', 'integer', 'min:1'],
        ]);

        // Garante que pelo menos desconto ou frete grátis foi definido
        if (empty($validated['discount_percentage']) && empty($validated['free_shipping'])) {
            return back()->withErrors([
                'discount_percentage' => 'Defina pelo menos uma percentagem de desconto ou active o frete grátis.',
            ]);
        }

        // Garante que o afiliado pertence à empresa
        $request->user()->company
            ->users()
            ->where('id', $validated['affiliate_id'])
            ->where('role', 'affiliate')
            ->firstOrFail();

        Coupon::create([
            'company_id'          => $request->user()->company_id,
            'affiliate_id'        => $validated['affiliate_id'],
            'code'                => strtoupper(trim($validated['code'])),
            'discount_percentage' => $validated['discount_percentage'] ?? null,
            'free_shipping'       => $validated['free_shipping'] ?? false,
            'expires_at'          => $validated['expires_at'] ?? null,
            'usage_limit'         => $validated['usage_limit'] ?? null,
        ]);

        return redirect()->route('admin.coupons.index')
            ->with('success', 'Cupão criado com sucesso!');
    }

    public function edit(Request $request, Coupon $coupon): Response
    {
        if ($coupon->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $coupon->load('affiliate');

        $affiliates = $request->user()->company
            ->users()
            ->where('role', 'affiliate')
            ->where('active', true)
            ->get(['id', 'name', 'email']);

        return Inertia::render('Admin/Coupons/Edit', [
            'coupon'     => $coupon,
            'affiliates' => $affiliates,
        ]);
    }

    public function update(Request $request, Coupon $coupon)
    {
        if ($coupon->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $validated = $request->validate([
            'affiliate_id'        => ['required', 'exists:users,id'],
            'code'                => ['required', 'string', 'max:255', 'unique:coupons,code,' . $coupon->id],
            'discount_percentage' => ['nullable', 'numeric', 'min:0.01', 'max:100'],
            'free_shipping'       => ['boolean'],
            'expires_at'          => ['nullable', 'date'],
            'usage_limit'         => ['nullable', 'integer', 'min:1'],
        ]);

        if (empty($validated['discount_percentage']) && empty($validated['free_shipping'])) {
            return back()->withErrors([
                'discount_percentage' => 'Defina pelo menos uma percentagem de desconto ou active o frete grátis.',
            ]);
        }

        $coupon->update([
            'affiliate_id'        => $validated['affiliate_id'],
            'code'                => strtoupper(trim($validated['code'])),
            'discount_percentage' => $validated['discount_percentage'] ?? null,
            'free_shipping'       => $validated['free_shipping'] ?? false,
            'expires_at'          => $validated['expires_at'] ?? null,
            'usage_limit'         => $validated['usage_limit'] ?? null,
        ]);

        return redirect()->route('admin.coupons.index')
            ->with('success', 'Cupão atualizado com sucesso!');
    }

    public function toggleActive(Request $request, Coupon $coupon)
    {
        if ($coupon->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $coupon->update(['active' => ! $coupon->active]);

        $status = $coupon->active ? 'ativado' : 'desativado';

        return redirect()->route('admin.coupons.index')
            ->with('success', "Cupão {$status} com sucesso!");
    }

    public function destroy(Request $request, Coupon $coupon)
    {
        if ($coupon->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $coupon->delete();

        return redirect()->route('admin.coupons.index')
            ->with('success', 'Cupão removido com sucesso!');
    }
}