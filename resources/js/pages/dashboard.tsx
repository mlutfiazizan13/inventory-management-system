import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { PageProps, Product, PurchaseOrder, Supplier, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    registerables
} from 'chart.js';
import { AlertCircle, ArrowDown, ArrowUp, ArrowUpDown, DollarSign, Package, Truck } from 'lucide-react';
import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import { formatRupiah } from '@/utils/currency-format';

ChartJS.register(...registerables);

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps extends PageProps {
    totalProducts: number;
    lowStock: Product[];
    inventoryValue: number;
    totalSuppliers: number;
    purchasesBySupplier: { supplier: Supplier; total: number }[];
    statusCounts: { purchase_order_status: string; total: number }[];
    purchases: { month: number; total: number }[];
    stockProducts: Product[];
}

export default function Dashboard() {
    const {totalProducts, lowStock, inventoryValue, totalSuppliers, purchasesBySupplier, statusCounts, purchases, stockProducts, latestPurchaseOrders } = usePage<DashboardProps>().props;

    // console.log(auth.user.menus);
    const columnHelper = createColumnHelper<PurchaseOrder>();
    const columns: ColumnDef<PurchaseOrder, any>[] = [
        columnHelper.accessor('supplier.name', {
            header: () => 'Supplier',
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('order_date', {
            header: () => 'Order Date',
            cell: ({ getValue }) => {
                const date = parseISO(getValue());
                return format(date, 'yyyy-MM-dd');
            },
        }),
        columnHelper.accessor('expected_date', {
            header: () => 'Expected Date',
            cell: ({ getValue }) => {
                const date = parseISO(getValue());
                return format(date, 'yyyy-MM-dd');
            },
        }),
        columnHelper.accessor('total_cost', {
            header: () => 'Total Cost',
            cell: (info) => formatRupiah(info.getValue()),
        }),
        columnHelper.accessor('purchase_order_status', {
            header: () => 'PO Status',
            cell: (info) => (
                <span className="capitalize">
                    {info.getValue()}
                </span>
            ),
        })
    ];

    const poTable = useReactTable({
        data: latestPurchaseOrders,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <div className="flex flex-col gap-4 justify-between p-6 border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                        {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                        <div className='flex justify-between items-center'>
                            <p className='text-lg text-[#9f9f9f]'>Total Product</p>
                            <div className='flex justify-center items-center h-10 w-10 rounded-full bg-gray-100'>
                                <Package />
                            </div>
                        </div>
                        <p className='text-3xl'>{totalProducts}</p>
                    </div>
                    <div className="flex flex-col gap-4 justify-between p-6 border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                        {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                        <div className='flex justify-between items-center'>
                            <p className='text-lg text-[#9f9f9f]'>Products Low in Stock</p>
                            <div className='flex justify-center items-center h-10 w-10 rounded-full bg-gray-100'>
                                <AlertCircle />
                            </div>
                        </div>
                        <p className='text-3xl'>{lowStock.length}</p>
                    </div>
                    <div className="flex flex-col gap-4 justify-between p-6 border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                        {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                        <div className='flex justify-between items-center'>
                            <p className='text-lg text-[#9f9f9f]'>Current Total Inventory Value</p>
                            <div className='flex justify-center items-center h-10 w-10 rounded-full bg-gray-100'>
                                <DollarSign />
                            </div>
                        </div>
                        <p className='text-3xl'>{formatRupiah(inventoryValue)}</p>
                    </div>
                    <div className="flex flex-col gap-4 justify-between p-6 border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                        {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                        <div className='flex justify-between items-center'>
                            <p className='text-lg text-[#9f9f9f]'>Total Suppliers</p>
                            <div className='flex justify-center items-center h-10 w-10 rounded-full bg-gray-100'>
                                <Truck />
                            </div>
                        </div>
                        <p className='text-3xl'>{totalSuppliers}</p>
                    </div>
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <div className='col-span-2 p-6 border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border'>
                        <div className='flex justify-between'>
                            <p className='mb-4 text-xl font-medium'>Ongoing Purchase Order</p>
                            <Link href={route('purchase_orders.index')} >View All </Link>
                        </div>

                        <table className="min-w-full overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-800">
                                {poTable.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                className="border border-gray-200 bg-black px-4 py-2 text-nowrap text-white dark:border-gray-700 dark:bg-primary-foreground dark:text-gray-100"
                                                onClick={header.column.getToggleSortingHandler()}
                                                style={{ width: header.getSize() }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {poTable.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className="even:bg-gray-50 dark:even:bg-gray-800">
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className="border border-gray-200 px-4 py-2 text-nowrap text-gray-900 dark:border-gray-700 dark:text-gray-100"
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                    <div className='p-6 border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border'>
                        <p className='mb-7 text-xl font-medium'>PO by Status</p>
                        <Pie
                            data={{
                                labels: statusCounts.map((item) => item.purchase_order_status),
                                datasets: [
                                    {
                                        data: statusCounts.map((item) => item.total),
                                        backgroundColor: [
                                            '#4e79a7', // blue
                                            '#f28e2b', // orange
                                            '#e15759', // red
                                            '#76b7b2', // teal
                                            '#59a14f', // green
                                            '#edc948', // yellow
                                            '#b07aa1', // purple
                                            '#9c755f', // brown
                                        ],
                                    },
                                ],
                            }}
                        />
                    </div>
                    <div className='p-6 border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border'>
                        <p className='mb-7 text-xl font-medium'>Purchases by Supplier</p>
                        <Doughnut
                            data={{
                                labels: purchasesBySupplier.map((item) => item.supplier.name),
                                datasets: [
                                    {
                                        data: purchasesBySupplier.map((item) => item.total),
                                        backgroundColor: [
                                            '#4e79a7', // soft blue
                                            '#f28e2b', // vivid orange
                                            '#e15759', // soft red
                                            '#76b7b2', // teal
                                            '#59a14f', // green
                                            '#edc948', // yellow
                                            '#b07aa1', // purple
                                            '#ff9da7', // light pink
                                        ],
                                    },
                                ],
                            }}
                        />
                    </div>
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <div className='p-6 border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border'>
                        <p className='mb-4 text-xl font-medium'>Ongoing Purchase Order</p>

                        <Line
                            data={{
                                labels: purchases.map((item) => item.month),
                                datasets: [
                                    {
                                        label: 'Total Purchases',
                                        data: purchases.map((item) => item.total),
                                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                                        borderColor: 'rgba(54, 162, 235, 1)',
                                        borderWidth: 2,
                                        fill: false, // optional: set to true if you want area under line filled
                                        tension: 0.4, // optional: makes the line curved
                                        pointRadius: 4, // optional: size of data points
                                    },
                                ],
                            }}
                            options={{
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            stepSize: 1000, // optional: adjust based on your data
                                        },
                                    },
                                    x: {
                                        ticks: {
                                            autoSkip: false // ensures all month names are shown
                                        }
                                    }
                                },
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top'
                                    },
                                    title: {
                                        display: true,
                                        text: 'Monthly Total Purchases'
                                    }
                                }
                            }}
                        />

                    </div>
                    <div className='p-6 border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border'>
                        <p className='mb-4 text-xl font-medium'>Inventory Levels by Product</p>
                        <div className='flex justify-center items-center'>
                            <Bar
                                data={{
                                    labels: stockProducts.map((item) => item.name),
                                    datasets: [
                                        {
                                            label: 'Stock Quantity',
                                            data: stockProducts.map((item) => item.inventory.quantity),
                                            backgroundColor: 'rgba(40, 167, 69, 0.5)',
                                            borderColor: 'rgba(40, 167, 69, 1)',
                                            borderWidth: 1
                                        },
                                    ],
                                }}
                                options={{ indexAxis: 'y', scales: { x: { beginAtZero: true } } }}
                            />

                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
