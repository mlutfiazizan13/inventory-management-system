import DeleteDialog from '@/components/modals/DeleteDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { useAppStore } from '@/stores/useAppStore';
import { useProductStore } from '@/stores/useProductStore';
import { PageProps, Product, StockAdjustment, StockItem, type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
    ColumnDef,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatRupiah } from '@/utils/currency-format';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Inventory Tracking',
        href: '/inventory-tracking',
    },
];

export default function InventoryTracking() {
    const page = usePage<PageProps>();

    const { inventories = [], stock_adjustments = [] } = page.props;

    // useEffect(() => {
    //     // Lakukan fetch dari server saat komponen mount
    //     router.reload({ only: ['products'] });
    // }, []);

    const { user } = useAppStore();

    const [sorting, setSorting] = useState<SortingState>([]);

    const [globalFilter, setGlobalFilter] = useState('');

    const [stockAdjustmentSorting, setStockAdjustmentSorting] = useState<SortingState>([]);

    const [stockAdjustmentGlobalFilter, setStockAdjustmentGlobalFilter] = useState('');

    const columnHelper = createColumnHelper<StockItem>();
    const columns: ColumnDef<StockItem, any>[] = [
        columnHelper.display({
            id: 'no',
            header: () => 'No',
            size: 50,
            cell: (info) => info.row.index + 1,
        }),
        columnHelper.accessor('product.name', {
            header: () => 'Product',
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('product.sku', {
            header: () => 'SKU',
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('quantity', {
            header: () => 'Quantity',
            cell: (info) => info.getValue()
        }),
        columnHelper.accessor('updated_at', {
            header: () => 'Updated At',
            cell: ({ getValue }) => {
                const value = getValue();
                if (!value) return '-';
                const date = parseISO(value);
                return format(date, 'yyyy-MM-dd HH:mm:ss');
            },
        })
    ];

    const table = useReactTable({
        data: inventories,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
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


    const stockAdjustmentColumnHelper = createColumnHelper<StockAdjustment>();
    const stockAdjustmentColumns: ColumnDef<StockAdjustment, any>[] = [
        stockAdjustmentColumnHelper.display({
            id: 'no',
            header: () => 'No',
            size: 50,
            cell: (info) => info.row.index + 1,
        }),
        stockAdjustmentColumnHelper.accessor('product.name', {
            header: () => 'Product',
            cell: (info) => info.getValue(),
        }),
        stockAdjustmentColumnHelper.accessor('adjustment_type', {
            header: () => 'Adjustment Type',
            cell: (info) => (
                <span className='uppercase'>
                    {info.getValue()}
                </span>
            ),
        }),
        stockAdjustmentColumnHelper.accessor('quantity', {
            header: () => 'Quantity',
            cell: (info) => info.getValue()
        }),
        stockAdjustmentColumnHelper.accessor('reason', {
            header: () => 'Reason',
            cell: (info) => info.getValue()
        }),
            stockAdjustmentColumnHelper.accessor('adjusted_by.name', {
            header: () => 'Adjusted By',
            cell: (info) => info.getValue()
        }),
        stockAdjustmentColumnHelper.accessor('updated_at', {
            header: () => 'Updated At',
            cell: ({ getValue }) => {
                const value = getValue();
                if (!value) return '-';
                const date = parseISO(value);
                return format(date, 'yyyy-MM-dd HH:mm:ss');
            },
        })
    ];

    const stockAdjustmentTable = useReactTable({
        data: stock_adjustments,
        columns: stockAdjustmentColumns,
        state: {
            sorting: stockAdjustmentSorting,
            globalFilter: stockAdjustmentGlobalFilter,
        },
        onSortingChange: setStockAdjustmentSorting,
        onGlobalFilterChange: setStockAdjustmentGlobalFilter,
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
            <Head title="Products" />
            <div className="container mx-auto p-4">
                <div className='mb-20'>
                    <div className="mb-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Inventory</h1>

                        <div className="flex gap-3">
                            <div className="">
                                <Input
                                    type="text"
                                    placeholder="Search.."
                                    value={globalFilter ?? ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
                                />
                            </div>
                            {/* <Button onClick={() => setCreateOpen(true) }>Create</Button> */}
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-800">
                                {table.getHeaderGroups().map((headerGroup) => (
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
                                                    {{
                                                        asc: <ArrowUp size={14} />,
                                                        desc: <ArrowDown size={14} />,
                                                    }[header.column.getIsSorted()] ?? <ArrowUpDown size={14} />}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.map((row) => (
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

                    {/* Loading Overlay */}
                    {useAppStore().globalLoading && (
                        <div className="bg-opacity-75 absolute inset-0 flex items-center justify-center bg-white">
                            <div className="flex items-center gap-2 text-blue-600">
                                <RefreshCw className="h-6 w-6 animate-spin" />
                                <span>Loading...</span>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="border-t border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                                {Math.min(
                                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                    table.getFilteredRowModel().rows.length,
                                )}{' '}
                                of {table.getFilteredRowModel().rows.length} results
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>

                                <span className="px-3 py-1 text-sm font-medium">
                                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                                </span>

                                <button
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Stock Adjustment</h1>

                        <div className="flex gap-3">
                            <div className="">
                                <Input
                                    type="text"
                                    placeholder="Search.."
                                    value={stockAdjustmentGlobalFilter ?? ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStockAdjustmentGlobalFilter(e.target.value)}
                                />
                            </div>
                            {/* <Button onClick={() => setCreateOpen(true) }>Create</Button> */}
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-800">
                                {stockAdjustmentTable.getHeaderGroups().map((headerGroup) => (
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
                                                    {{
                                                        asc: <ArrowUp size={14} />,
                                                        desc: <ArrowDown size={14} />,
                                                    }[header.column.getIsSorted()] ?? <ArrowUpDown size={14} />}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {stockAdjustmentTable.getRowModel().rows.map((row) => (
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

                    {/* Loading Overlay */}
                    {useAppStore().globalLoading && (
                        <div className="bg-opacity-75 absolute inset-0 flex items-center justify-center bg-white">
                            <div className="flex items-center gap-2 text-blue-600">
                                <RefreshCw className="h-6 w-6 animate-spin" />
                                <span>Loading...</span>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="border-t border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing {stockAdjustmentTable.getState().pagination.pageIndex * stockAdjustmentTable.getState().pagination.pageSize + 1} to{' '}
                                {Math.min(
                                    (stockAdjustmentTable.getState().pagination.pageIndex + 1) * stockAdjustmentTable.getState().pagination.pageSize,
                                    stockAdjustmentTable.getFilteredRowModel().rows.length,
                                )}{' '}
                                of {stockAdjustmentTable.getFilteredRowModel().rows.length} results
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => stockAdjustmentTable.previousPage()}
                                    disabled={!stockAdjustmentTable.getCanPreviousPage()}
                                    className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>

                                <span className="px-3 py-1 text-sm font-medium">
                                    Page {stockAdjustmentTable.getState().pagination.pageIndex + 1} of {stockAdjustmentTable.getPageCount()}
                                </span>

                                <button
                                    onClick={() => stockAdjustmentTable.nextPage()}
                                    disabled={!stockAdjustmentTable.getCanNextPage()}
                                    className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
