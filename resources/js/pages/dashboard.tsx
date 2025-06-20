import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { PageProps, Product, PurchaseOrder, Supplier, type BreadcrumbItem } from '@/types';
import { formatRupiah } from '@/utils/currency-format';
import { Head, usePage } from '@inertiajs/react';
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
import DashboardInventory from './dashboard/dashboard-inventory';
import DashboardSales from './dashboard/dashboard-sales';

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
    salesSummary: {
        totalSales: number;
        totalOrders: number;
        monthlyAverage: number;
        totalCustomers: number;
    };
}

export default function Dashboard() {
    const {
        totalProducts,
        lowStock,
        inventoryValue,
        totalSuppliers,
        purchasesBySupplier,
        statusCounts,
        purchases,
        stockProducts,
        latestPurchaseOrders,
        salesSummary,
    } = usePage<DashboardProps>().props;

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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <Tabs defaultValue="inventory" className='p-4'>
                <TabsList>
                    <TabsTrigger value="inventory">Inventory</TabsTrigger>
                    <TabsTrigger value="sales">Sales</TabsTrigger>
                </TabsList>
                <TabsContent  value="inventory">
                    <DashboardInventory/>    
                </TabsContent>
                <TabsContent value="sales">
                    <DashboardSales/>
                </TabsContent>
            </Tabs>
        </AppLayout>
    );
}
