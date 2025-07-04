<?php

namespace App\Providers;

use App\Models\Menu;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'auth.user' => function () {
                return Auth::user()
                    ? Auth::user()->only('id', 'name', 'email') // only necessary fields
                    : null;
            },
            'mainNavItems' => function () {
                return Auth::user()
                    ? $this->buildMenuTree(Auth::user()->roles[0]->menus()->orderBy('order')->get()) // only necessary fields
                    : null;
            }
        ]);
    }

    protected function buildMenuTree($items, $parentId = '')
    {
        return $items
            ->filter(fn($item) => $item->parent_id === $parentId)
            ->map(function ($item) use ($items) {
                return [
                    'title' => $item->description ?? $item->title,
                    'href'  => $item->url,
                    'icon'  => $item->icon,
                    'type'  => $item->type,
                    'children' => $this->buildMenuTree($items, $item->id) ?? null,
                ];
            })
            ->values();
    }
}
