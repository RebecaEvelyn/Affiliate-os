<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $products = Product::where('company_id', $request->user()->company_id)
            ->latest()
            ->get();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Products/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'external_id'     => ['required', 'string', 'max:255'],
            'name'            => ['required', 'string', 'max:255'],
            'commission_rate' => ['required', 'numeric', 'min:0.01', 'max:100'],
        ]);

        // Garante que o external_id é único na empresa
        $exists = Product::where('company_id', $request->user()->company_id)
            ->where('external_id', $validated['external_id'])
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'external_id' => 'Já existe um produto com este ID externo na sua empresa.',
            ]);
        }

        Product::create([
            'company_id'      => $request->user()->company_id,
            'external_id'     => $validated['external_id'],
            'name'            => $validated['name'],
            'commission_rate' => $validated['commission_rate'],
        ]);

        return redirect()->route('admin.products.index')
            ->with('success', 'Produto criado com sucesso!');
    }

    public function edit(Request $request, Product $product): Response
    {
        if ($product->company_id !== $request->user()->company_id) {
            abort(403);
        }

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        if ($product->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $validated = $request->validate([
            'external_id'     => ['required', 'string', 'max:255'],
            'name'            => ['required', 'string', 'max:255'],
            'commission_rate' => ['required', 'numeric', 'min:0.01', 'max:100'],
        ]);

        // Garante que o external_id é único na empresa (excluindo o próprio)
        $exists = Product::where('company_id', $request->user()->company_id)
            ->where('external_id', $validated['external_id'])
            ->where('id', '!=', $product->id)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'external_id' => 'Já existe um produto com este ID externo na sua empresa.',
            ]);
        }

        $product->update([
            'external_id'     => $validated['external_id'],
            'name'            => $validated['name'],
            'commission_rate' => $validated['commission_rate'],
        ]);

        return redirect()->route('admin.products.index')
            ->with('success', 'Produto atualizado com sucesso!');
    }

    public function toggleActive(Request $request, Product $product)
    {
        if ($product->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $product->update(['active' => ! $product->active]);

        $status = $product->active ? 'ativado' : 'desativado';

        return redirect()->route('admin.products.index')
            ->with('success', "Produto {$status} com sucesso!");
    }

    public function destroy(Request $request, Product $product)
    {
        if ($product->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Produto removido com sucesso!');
    }
}