<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $menus = [
            // Dashboard
            [
                'id' => 'DASHBOARD',
                'parent_id' => '',
                'action' => 'view',
                'type' => 'menu-header',
                'url' => '/dashboard',
                'description' => 'Dashboard',
                'icon' => 'LayoutDashboard',
                'order' => 1,
                'status' => 'active',
            ],

            // Framework
            [
                'id' => 'FRAMEWORK',
                'parent_id' => '',
                'action' => '',
                'type' => 'menu-header',
                'url' => '',
                'description' => 'Framework',
                'icon' => 'Settings',
                'order' => 2,
                'status' => 'active',
            ],
            [
                'id' => 'USERS',
                'parent_id' => 'FRAMEWORK',
                'action' => 'view',
                'type' => 'menu-item',
                'url' => '/users',
                'description' => 'Users',
                'icon' => 'Users',
                'order' => 1,
                'status' => 'active',
            ],
            [
                'id' => 'USER_CREATE',
                'parent_id' => 'USERS',
                'action' => 'create',
                'type' => 'action',
                'url' => '',
                'description' => '',
                'icon' => '',
                'order' => 1,
                'status' => 'active',
            ],
            [
                'id' => 'USER_UPDATE',
                'parent_id' => 'USERS',
                'action' => 'update',
                'type' => 'action',
                'url' => '',
                'description' => '',
                'icon' => '',
                'order' => 2,
                'status' => 'active',
            ],
            [
                'id' => 'USER_DELETE',
                'parent_id' => 'USERS',
                'action' => 'delete',
                'type' => 'action',
                'url' => '',
                'description' => '',
                'icon' => '',
                'order' => 3,
                'status' => 'active',
            ],
            [
                'id' => 'ROLES',
                'parent_id' => 'FRAMEWORK',
                'action' => 'view',
                'type' => 'menu-item',
                'url' => '/roles',
                'description' => 'Roles',
                'icon' => 'ShieldCheck',
                'order' => 2,
                'status' => 'active',
            ],
            [
                'id' => 'ROLE_CREATE',
                'parent_id' => 'ROLES',
                'action' => 'create',
                'type' => 'action',
                'url' => '',
                'description' => '',
                'icon' => '',
                'order' => 1,
                'status' => 'active',
            ],
            [
                'id' => 'ROLE_UPDATE',
                'parent_id' => 'ROLES',
                'action' => 'update',
                'type' => 'action',
                'url' => '',
                'description' => '',
                'icon' => '',
                'order' => 2,
                'status' => 'active',
            ],
            [
                'id' => 'ROLE_DELETE',
                'parent_id' => 'ROLES',
                'action' => 'delete',
                'type' => 'action',
                'url' => '',
                'description' => '',
                'icon' => '',
                'order' => 3,
                'status' => 'active',
            ],

            // Inventory
            [
                'id' => 'INVENTORY',
                'parent_id' => '',
                'action' => '',
                'type' => 'menu-header',
                'url' => '',
                'description' => 'Inventory',
                'icon' => 'Boxes',
                'order' => 3,
                'status' => 'active',
            ],
            [
                'id' => 'PRODUCTS',
                'parent_id' => 'INVENTORY',
                'action' => 'view',
                'type' => 'menu-item',
                'url' => '/products',
                'description' => 'Products',
                'icon' => 'Package',
                'order' => 1,
                'status' => 'active',
            ],
            [
                'id' => 'PRODUCT_CREATE',
                'parent_id' => 'PRODUCTS',
                'action' => 'create',
                'type' => 'action',
                'url' => '',
                'description' => '',
                'icon' => '',
                'order' => 1,
                'status' => 'active',
            ],
            [
                'id' => 'PRODUCT_UPDATE',
                'parent_id' => 'PRODUCTS',
                'action' => 'update',
                'type' => 'action',
                'url' => '',
                'description' => '',
                'icon' => '',
                'order' => 2,
                'status' => 'active',
            ],
            [
                'id' => 'PRODUCT_DELETE',
                'parent_id' => 'PRODUCTS',
                'action' => 'delete',
                'type' => 'action',
                'url' => '',
                'description' => '',
                'icon' => '',
                'order' => 3,
                'status' => 'active',
            ],
            [
                'id' => 'STOCK_ITEMS',
                'parent_id' => 'INVENTORY',
                'action' => 'view',
                'type' => 'menu-item',
                'url' => '/stock-items',
                'description' => 'Stock Items',
                'icon' => 'Boxes',
                'order' => 2,
                'status' => 'active',
            ],
            [
                'id' => 'STOCK_CREATE',
                'parent_id' => 'STOCK_ITEMS',
                'action' => 'create',
                'type' => 'action',
                'url' => '',
                'description' => '',
                'icon' => '',
                'order' => 1,
                'status' => 'active',
            ],
            [
                'id' => 'STOCK_UPDATE',
                'parent_id' => 'STOCK_ITEMS',
                'action' => 'update',
                'type' => 'action',
                'url' => '',
                'description' => '',
                'icon' => '',
                'order' => 2,
                'status' => 'active',
            ],
            [
                'id' => 'STOCK_DELETE',
                'parent_id' => 'STOCK_ITEMS',
                'action' => 'delete',
                'type' => 'action',
                'url' => '',
                'description' => '',
                'icon' => '',
                'order' => 3,
                'status' => 'active',
            ],

            // Supply Chain
            [
                'id' => 'SUPPLY_CHAIN',
                'parent_id' => '',
                'action' => '',
                'type' => 'menu-header',
                'url' => '',
                'description' => 'Supply Chain',
                'icon' => 'Truck',
                'order' => 4,
                'status' => 'active',
            ],
            [
                'id' => 'SUPPLIERS',
                'parent_id' => 'SUPPLY_CHAIN',
                'action' => 'view',
                'type' => 'menu-item',
                'url' => '/suppliers',
                'description' => 'Suppliers',
                'icon' => 'Truck',
                'order' => 1,
                'status' => 'active',
            ],
            [
                'id' => 'SUPPLIER_CREATE',
                'parent_id' => 'SUPPLIERS',
                'action' => 'create',
                'type' => 'action',
                'url' => '',
                'description' => '',
                'icon' => '',
                'order' => 1,
                'status' => 'active',
            ],
            [
                'id' => 'SUPPLIER_UPDATE',
                'parent_id' => 'SUPPLIERS',
                'action' => 'update',
                'type' => 'action',
                'url' => '',
                'description' => '',
                'icon' => '',
                'order' => 2,
                'status' => 'active',
            ],
            [
                'id' => 'SUPPLIER_DELETE',
                'parent_id' => 'SUPPLIERS',
                'action' => 'delete',
                'type' => 'action',
                'url' => '',
                'description' => '',
                'icon' => '',
                'order' => 3,
                'status' => 'active',
            ],
            [
                'id' => 'PURCHASE_ORDERS',
                'parent_id' => 'SUPPLY_CHAIN',
                'action' => 'view',
                'type' => 'menu-item',
                'url' => '/purchase-orders',
                'description' => 'Purchase Orders',
                'icon' => 'FileText',
                'order' => 2,
                'status' => 'active',
            ],
            [
                'id' => 'PURCHASE_CREATE',
                'parent_id' => 'PURCHASE_ORDERS',
                'action' => 'create',
                'type' => 'action',
                'url' => '',
                'description' => '',
                'icon' => '',
                'order' => 1,
                'status' => 'active',
            ],
            [
                'id' => 'PURCHASE_UPDATE',
                'parent_id' => 'PURCHASE_ORDERS',
                'action' => 'update',
                'type' => 'action',
                'url' => '',
                'description' => '',
                'icon' => '',
                'order' => 2,
                'status' => 'active',
            ],
            [
                'id' => 'PURCHASE_DELETE',
                'parent_id' => 'PURCHASE_ORDERS',
                'action' => 'delete',
                'type' => 'action',
                'url' => '',
                'description' => '',
                'icon' => '',
                'order' => 3,
                'status' => 'active',
            ],

            // Sales
            [
                'id' => 'SALES',
                'parent_id' => '',
                'action' => '',
                'type' => 'menu-header',
                'url' => '',
                'description' => 'Sales',
                'icon' => 'ShoppingCart',
                'order' => 5,
                'status' => 'active',
            ],
            [
                'id' => 'CUSTOMERS',
                'parent_id' => 'SALES',
                'action' => 'view',
                'type' => 'menu-item',
                'url' => '/customers',
                'description' => 'Customers',
                'icon' => 'Briefcase',
                'order' => 1,
                'status' => 'active',
            ],
            [
                'id' => 'CUSTOMER_CREATE',
                'parent_id' => 'CUSTOMERS',
                'action' => 'create',
                'type' => 'action',
                'url' => '',
                'description' => '',
                'icon' => '',
                'order' => 1,
                'status' => 'active',
            ],
            [
                'id' => 'CUSTOMER_UPDATE',
                'parent_id' => 'CUSTOMERS',
                'action' => 'update',
                'type' => 'action',
                'url' => '',
                'description' => '',
                'icon' => '',
                'order' => 2,
                'status' => 'active',
            ],
            [
                'id' => 'CUSTOMER_DELETE',
                'parent_id' => 'CUSTOMERS',
                'action' => 'delete',
                'type' => 'action',
                'url' => '',
                'description' => '',
                'icon' => '',
                'order' => 3,
                'status' => 'active',
            ],
            [
                'id' => 'SALES_ORDERS',
                'parent_id' => 'SALES',
                'action' => 'view',
                'type' => 'menu-item',
                'url' => '/sales-orders',
                'description' => 'Sales Orders',
                'icon' => 'ClipboardList',
                'order' => 2,
                'status' => 'active',
            ],
            [
                'id' => 'SALES_CREATE',
                'parent_id' => 'SALES_ORDERS',
                'action' => 'create',
                'type' => 'action',
                'url' => '',
                'description' => '',
                'icon' => '',
                'order' => 1,
                'status' => 'active',
            ],
            [
                'id' => 'SALES_UPDATE',
                'parent_id' => 'SALES_ORDERS',
                'action' => 'update',
                'type' => 'action',
                'url' => '',
                'description' => '',
                'icon' => '',
                'order' => 2,
                'status' => 'active',
            ],
            [
                'id' => 'SALES_DELETE',
                'parent_id' => 'SALES_ORDERS',
                'action' => 'delete',
                'type' => 'action',
                'url' => '',
                'description' => '',
                'icon' => '',
                'order' => 3,
                'status' => 'active',
            ],

            // Reports
            [
                'id' => 'REPORTS',
                'parent_id' => '',
                'action' => 'view',
                'type' => 'menu-header',
                'url' => '/inventory-tracking',
                'description' => 'Reports',
                'icon' => 'BarChart3',
                'order' => 6,
                'status' => 'active',
            ],
        ];


        DB::table('menus')->insert($menus);

        foreach ($menus as $menu) {
            DB::table('role_menus')->insert([
                'role_id' => 1,
                'menu_id' => $menu['id'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $imMenu = Menu::whereIn(
            'id',
            [
                'INVENTORY',
                'PRODUCTS',
                'PRODUCT_CREATE',
                'PRODUCT_DELETE',
                'PRODUCT_UPDATE',
                'STOCK_ITEMS',
                'STOCK_CREATE',
                'STOCK_UPDATE',
                'STOCK_DELETE',
                'SUPPLY_CHAIN',
                'PURCHASE_ORDERS',
                'PURCHASE_CREATE',
                'PURCHASE_UPDATE',
                'PURCHASE_DELETE',
                'REPORTS'
            ]
        )->get();

        foreach ($imMenu as $menu) {
            DB::table('role_menus')->insert([
                'role_id' => 2,
                'menu_id' => $menu['id'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }


        $salesMenu = Menu::whereIn(
            'id',
            [
                'SALES',
                'CUSTOMERS',
                'CUSTOMER_CREATE',
                'CUSTOMER_UPDATE',
                'SALES_ORDERS',
                'SALES_CREATE',
                'SALES_UPDATE',
                'REPORTS'
            ]
        )->get();

        foreach ($salesMenu as $menu) {
            DB::table('role_menus')->insert([
                'role_id' => 4,
                'menu_id' => $menu['id'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $psMenu = Menu::whereIn(
            'id',
            [
                'SUPPLY_CHAIN',
                'SUPPLIERS',
                'SUPPLIER_CREATE',
                'SUPPLIER_UPDATE',
                'PURCHASE_ORDERS',
                'PURCHASE_CREATE',
                'PURCHASE_UPDATE',
                'REPORTS'
            ]
        )->get();

        foreach ($psMenu as $menu) {
            DB::table('role_menus')->insert([
                'role_id' => 5,
                'menu_id' => $menu['id'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
