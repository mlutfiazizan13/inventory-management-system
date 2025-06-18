import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BarChart3, BookOpen, Boxes, Briefcase, ClipboardList, FileText, Folder, LayoutDashboard, LayoutGrid, Package, ReceiptText, Settings, ShieldCheck, ShoppingCart, Truck, Users, Users2, Warehouse } from 'lucide-react';
import AppLogo from './app-logo';

// const mainNavItems: NavItem[] = [
//     {
//         title: 'Dashboard',
//         href: '/dashboard',
//         icon: LayoutDashboard,
//     },
//     {
//         title: 'Framework',
//         icon: Settings,
//         children: [
//             {
//                 title: 'Users',
//                 href: '/users',
//                 icon: Users,
//             },
//             {
//                 title: 'Roles',
//                 href: '/roles',
//                 icon: ShieldCheck,
//             },
//         ],
//     },
//     {
//         title: 'Inventory',
//         icon: Boxes,
//         children: [
//             {
//                 title: 'Products',
//                 href: '/products',
//                 icon: Package,
//             },
//             {
//                 title: 'Stock Items',
//                 href: '/stock-items',
//                 icon: Boxes,
//             },
//         ],
//     },
//     {
//         title: 'Supply Chain',
//         icon: Truck,
//         children: [
//             {
//                 title: 'Suppliers',
//                 href: '/suppliers',
//                 icon: Truck,
//             },
//             {
//                 title: 'Purchase Orders',
//                 href: '/purchase-orders',
//                 icon: FileText,
//             },
//         ],
//     },
//     {
//         title: 'Sales',
//         icon: ShoppingCart,
//         children: [
//             {
//                 title: 'Customer',
//                 href: '/customers',
//                 icon: Briefcase,
//             },
//             {
//                 title: 'Sales Orders',
//                 href: '/sales-orders',
//                 icon: ClipboardList,
//             },
//         ],
//     },
//     {
//         title: 'Reports',
//         href: '/inventory-tracking',
//         icon: BarChart3,
//     },
// ];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {

    const { mainNavItems } = usePage<{ mainNavItems: NavItem[] }>().props;

    console.log(mainNavItems)

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
