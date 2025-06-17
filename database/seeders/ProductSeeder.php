<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Nike Air Max',
                'sku' => 'NIK-AM-001',
                'unit' => 'pcs',
                'category_id' => 'SHO',
                'brand_id' => 'NIK',
                'currency' => 'IDR',
                'price' => 1500000,
                'status' => 'active',
            ],
            [
                'name' => 'Adidas Ultraboost',
                'sku' => 'ADI-UB-002',
                'unit' => 'pcs',
                'category_id' => 'RUN',
                'brand_id' => 'ADI',
                'currency' => 'IDR',
                'price' => 1800000,
                'status' => 'active',
            ],
            [
                'name' => 'Puma RS-X',
                'sku' => 'PUM-RSX-003',
                'unit' => 'pcs',
                'category_id' => 'SNK',
                'brand_id' => 'PUM',
                'currency' => 'IDR',
                'price' => 1200000,
                'status' => 'inactive',
            ],
            [
                'name' => 'Reebok Classic',
                'sku' => 'REE-CL-004',
                'unit' => 'pcs',
                'category_id' => 'CAS',
                'brand_id' => 'REE',
                'currency' => 'IDR',
                'price' => 900000,
                'status' => 'active',
            ],
            [
                'name' => 'New Balance 574',
                'sku' => 'NWB-574-005',
                'unit' => 'pcs',
                'category_id' => 'CAS',
                'brand_id' => 'NWB',
                'currency' => 'IDR',
                'price' => 1300000,
                'status' => 'active',
            ],
            [
                'name' => 'Vans Old Skool',
                'sku' => 'VNS-OS-006',
                'unit' => 'pcs',
                'category_id' => 'SNK',
                'brand_id' => 'VNS',
                'currency' => 'IDR',
                'price' => 850000,
                'status' => 'active',
            ],
            [
                'name' => 'Skechers GOwalk',
                'sku' => 'SKC-GW-007',
                'unit' => 'pcs',
                'category_id' => 'SDL',
                'brand_id' => 'SKC',
                'currency' => 'IDR',
                'price' => 1100000,
                'status' => 'active',
            ],
            [
                'name' => 'Nike Court Legacy Lift',
                'sku' => 'NIK-CL-008',
                'unit' => 'pcs',
                'category_id' => 'SNK',
                'brand_id' => 'NIK',
                'currency' => 'IDR',
                'price' => 899000,
                'status' => 'active',
            ],
            [
                'name' => 'Adidas Campus 00s',
                'sku' => 'ADI-CMP-009',
                'unit' => 'pcs',
                'category_id' => 'CAS',
                'brand_id' => 'ADI',
                'currency' => 'IDR',
                'price' => 1600000,
                'status' => 'active',
            ],
            [
                'name' => 'Puma Future Rider Play',
                'sku' => 'PUM-FRP-010',
                'unit' => 'pcs',
                'category_id' => 'RUN',
                'brand_id' => 'PUM',
                'currency' => 'IDR',
                'price' => 1000000,
                'status' => 'inactive',
            ]
        ];

        DB::table('products')->insert($products);

        // Assign fake IDs for simulation purposes
        $productsWithId = [];
        $productIds = [];

        foreach ($products as $index => $product) {
            $id = $index + 1; // Simulate DB id starting at 1
            $product['id'] = $id;
            $productsWithId[] = $product;
            $productIds[$product['sku']] = $id;
        }

        // Create stock items
        $stock_items = array_map(function ($product) {
            return [
                'product_id' => $product['id'],
                'quantity' => 10, // Default quantity
                'status' => $product['status'], // Use product status or set custom
            ];
        }, $productsWithId);

        DB::table('stock_items')->insert($stock_items);
    }
}
