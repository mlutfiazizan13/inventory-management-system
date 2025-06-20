import { PageProps, PurchaseOrder, type BreadcrumbItem } from '@/types';
import { formatRupiah } from '@/utils/currency-format';
import { usePage } from '@inertiajs/react';
import {
    ColumnDef,
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Chart as ChartJS, registerables } from 'chart.js';
import { format, parseISO } from 'date-fns';
import { ClipboardList, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(...registerables);

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type SalesByMonth = { month: string; total: number };
type RecentOrder = { id: number; customer_name: string; total_amount: number; status: string; created_at: string };

interface DashboardProps extends PageProps {
    salesByMonth: SalesByMonth[];
    recentOrders: RecentOrder[];
    salesSummary: {
        totalSales: number;
        totalOrders: number;
        monthlyAverage: number;
        totalCustomers: number;
    };
    sales: { month: number; total: number }[];
    topProducts: { product_name: string; total_sold: number }[];
    salesByCustomer: { customer_name: string; total: number }[];
}

export default function DashboardSales() {
    const { salesByMonth, latestPurchaseOrders, salesSummary, sales, topProducts, salesByCustomer } = usePage<DashboardProps>().props;

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
            cell: (info) => <span className="capitalize">{info.getValue()}</span>,
        }),
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
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex flex-col justify-between gap-4 overflow-hidden rounded-xl border p-6">
                        {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                        <div className="flex items-center justify-between">
                            <p className="text-lg text-[#9f9f9f]">Total Sales</p>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                <ShoppingBag />
                            </div>
                        </div>
                        <p className="text-3xl">{formatRupiah(salesSummary.totalSales)}</p>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex flex-col justify-between gap-4 overflow-hidden rounded-xl border p-6">
                        {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                        <div className="flex items-center justify-between">
                            <p className="text-lg text-[#9f9f9f]">Total Orders</p>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                <ClipboardList />
                            </div>
                        </div>
                        <p className="text-3xl">{salesSummary.totalOrders}</p>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex flex-col justify-between gap-4 overflow-hidden rounded-xl border p-6">
                        {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                        <div className="flex items-center justify-between">
                            <p className="text-lg text-[#9f9f9f]">Avg. Order</p>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                <TrendingUp />
                            </div>
                        </div>
                        <p className="text-3xl">{formatRupiah(salesSummary.monthlyAverage)}</p>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex flex-col justify-between gap-4 overflow-hidden rounded-xl border p-6">
                        {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                        <div className="flex items-center justify-between">
                            <p className="text-lg text-[#9f9f9f]">Total Customers</p>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                <Users />
                            </div>
                        </div>
                        <p className="text-3xl">{salesSummary.totalCustomers}</p>
                    </div>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-6">
                    <p className="mb-4 text-xl font-medium">Monthly Total Sales</p>

                    <Line
                        data={{
                            labels: sales.map((item) => item.month),
                            datasets: [
                                {
                                    label: 'Total Sales',
                                    data: sales.map((item) => item.total),
                                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    borderWidth: 2,
                                    fill: false,
                                    tension: 0.4,
                                    pointRadius: 4,
                                },
                            ],
                        }}
                        options={{
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        stepSize: 1000,
                                    },
                                },
                                x: {
                                    ticks: {
                                        autoSkip: false,
                                    },
                                },
                            },
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Monthly Total Sales',
                                },
                            },
                        }}
                    />
                </div>
            </div>

            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="col-span-2 border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-6">
                    <p className="mb-4 text-xl font-medium">Top 5 Best-Selling Products</p>
                    <div className="flex items-center justify-center">
                        <Bar
                            data={{
                                labels: topProducts.map((p) => p.product_name),
                                datasets: [
                                    {
                                        label: 'Quantity Sold',
                                        data: topProducts.map((p) => p.total_sold),
                                        backgroundColor: 'rgba(153, 102, 255, 0.6)',
                                    },
                                ],
                            }}
                            options={{
                                indexAxis: 'y',
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'Top 5 Best-Selling Products',
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-6">
                    <p className="mb-4 text-xl font-medium">Top 5 Best-Selling Products</p>
                    <div className="flex items-center justify-center">
                        <Pie
                            data={{
                                labels: salesByCustomer.map((c) => c.customer_name),
                                datasets: [
                                    {
                                        label: 'Sales by Customer',
                                        data: salesByCustomer.map((c) => c.total),
                                        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF'],
                                    },
                                ],
                            }}
                            options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'Top Customers by Sales',
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
