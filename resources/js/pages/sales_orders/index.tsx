import DeleteDialog from '@/components/modals/DeleteDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { useAppStore } from '@/stores/useAppStore';
import { PageProps, PurchaseOrder, SalesOrder, Supplier, type BreadcrumbItem } from '@/types';
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
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, Edit, Ellipsis, EllipsisVertical, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSalesOrderStore } from '@/stores/useSalesOrderStore';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CreateSupplier from './components/create';
import EditSupplier from './components/edit';
import { cn } from '@/lib/utils';
import CreateSalesOrder from './components/create';
import EditSalesOrder from './components/edit';
import { formatRupiah } from '@/utils/currency-format';
import UpdateStatus from './components/update-status';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Sales Orders',
        href: '/sales-orders',
    },
];

export default function Salesrders() {
    const page = usePage<PageProps<SalesOrder>>();

    const { data, sales_orders = [], customers = [], products = [] } = page.props;

    const stopDeleting = useSalesOrderStore((state) => state.stopDeleting);
    const stopUpdateStatus = useSalesOrderStore((state) => state.stopUpdateStatus);


    const { startEditing, startCreating, startDeleting, deletingItem, startUpdateStatus, updateStatusItem } = useSalesOrderStore();

    useEffect(() => {
        // Lakukan fetch dari server saat komponen mount
        router.reload({ only: ['sales_orders'] });
    }, []);

    const { user } = useAppStore();

    const [sorting, setSorting] = useState<SortingState>([]);

    const [globalFilter, setGlobalFilter] = useState('');

    const columnHelper = createColumnHelper<SalesOrder>();
    const columns: ColumnDef<SalesOrder, any>[] = [
        columnHelper.display({
            id: 'no',
            header: () => 'No',
            size: 50,
            cell: (info) => info.row.index + 1,
        }),
        columnHelper.accessor('customer.name', {
            header: () => 'Customer',
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('order_date', {
            header: () => 'Order Date',
            cell: ({ getValue }) => {
                const date = parseISO(getValue());
                return format(date, 'yyyy-MM-dd');
            },
        }),
        columnHelper.accessor('total_amount', {
            header: () => 'Total Amount',
            cell: (info) => formatRupiah(info.getValue()),
        }),
        columnHelper.accessor('sales_status', {
            header: () => 'PO Status',
            cell: (info) => (
                <span className="capitalize">
                    {info.getValue()}
                </span>
            ),
        }),
        columnHelper.accessor('created_at', {
            header: () => 'Created At',
            cell: ({ getValue }) => {
                const date = parseISO(getValue());
                return format(date, 'yyyy-MM-dd HH:mm:ss');
            },
        }),
        columnHelper.accessor('updated_at', {
            header: () => 'Updated At',
            cell: ({ getValue }) => {
                const date = parseISO(getValue());
                return format(date, 'yyyy-MM-dd HH:mm:ss');
            },
        }),
        columnHelper.display({
            id: 'actions',
            header: () => 'Action',
            size: 50,
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className='w-full'>
                            <Button variant="ghost"><Ellipsis /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="start">
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    Show Items
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => startUpdateStatus(row.original)}>
                                    Update Status
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => startEditing(row.original)}>
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className='text-destructive' onClick={() => startDeleting(row.original)}>
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        }),
    ];

    const table = useReactTable({
        data: sales_orders,
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sales Orders" />
            <div className="container mx-auto p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Sales Orders</h1>

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
                        <Button
                            onClick={() => {
                                startCreating();
                            }}
                        >
                            Create
                        </Button>
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
                                            className={cn(`border border-gray-200 px-4 py-2 text-nowrap text-gray-900 dark:border-gray-700 dark:text-gray-100`,
                                                cell.column.columnDef.meta?.className ?? ""
                                            )}
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


            <CreateSalesOrder customers={customers} products={products} />

            <EditSalesOrder customers={customers} products={products} />

            <UpdateStatus<string>
                title='Update Status'
                message='are you sure to update this status ?'
                onOpenChange={() => {
                    stopUpdateStatus();
                }}
                onSubmit={useSalesOrderStore().updateStatus}
                open={useSalesOrderStore.getState().isUpdateStatus}
                id={updateStatusItem?.id}
            />

            {/* <UpdateStatus<string>
                title='Update Status'
                message='are you sure to update this status ?'
                onOpenChange={() => {
                    stopUpdateStatus();
                    console.log("id", updateStatusItem)
                }}
                onSubmit={useSalesOrderStore().updateStatus}
                open={useSalesOrderStore.getState().isUpdateStatus}
                id={updateStatusItem?.id}
            />

            <DeleteDialog<SalesOrder | null, string>
                resource={useSalesOrderStore().deletingItem}
                id={deletingItem?.id}
                onDelete={useSalesOrderStore().deleteItem}
                open={useSalesOrderStore.getState().isDeleting}
                onOpenChange={() => {
                    stopDeleting();
                }}
                itemName="sales order"
                renderName={String(deletingItem?.id)}
            /> */}
        </AppLayout>
    );
}
