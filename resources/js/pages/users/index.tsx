import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Users',
        href: '/users',
    },
];

export default function Users() {
    const { users } = usePage<{ users: User[] }>().props;

    const columnHelper = createColumnHelper<User>();

    const columns: ColumnDef<User, any>[] = [
        columnHelper.accessor('id', {
            header: () => 'ID',
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('name', {
            header: () => 'Name',
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('email', {
            header: () => 'Email',
            cell: (info) => info.getValue(),
        }),
        columnHelper.display({
            id: 'actions',
            header: () => 'Action',
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex gap-2">
                        <Button variant={'default'}>
                            Edit
                        </Button>
                        <Button variant={'destructive'}>
                            Delete
                        </Button>
                    </div>
                );
            },
        }),
    ];

    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="container mx-auto p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Users</h1>
                    <Button>Create</Button>
                </div>

                <table className="min-w-full overflow-hidden rounded-md border border-gray-200">
                    <thead className="bg-gray-100">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="border bg-black px-4 py-2 text-white">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="even:bg-gray-50">
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="border px-4 py-2">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
