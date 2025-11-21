import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/app/lib/auth';
import { ROLES } from '@/app/lib/constants/roles';
import { menuByRole } from '@/app/(feat)/config/rol';

function getAllowedHrefsForRole(roleName: string): string[] {
    const roleMenu = menuByRole[roleName as keyof typeof menuByRole];
    if (!roleMenu) return [];

    const allowed = new Set<string>();

    roleMenu.menu.forEach(item => {
        if (item.href) {
            allowed.add(item.href);
            if (item.href === '/reportes') {
                allowed.add('/reportes');
                allowed.add('/reportes?report=low_stock');
                allowed.add('/reportes?report=movement_history');
                allowed.add('/reportes?report=users');
                allowed.add('/reportes?report=bodegas');
                allowed.add('/reportes?report=materials');
                allowed.add('/reportes?report=my_movements');
                allowed.add('/reportes?report=my_inventory');
                allowed.add('/reportes?report=my_requisitions');
                allowed.add('/reportes?report=project_usage');
                allowed.add('/reportes?report=received_history');
            }
            if (item.href === '/inventario') {
                allowed.add('/inventario');
            }
        }
        if (item.subItems) {
            item.subItems.forEach(subItem => allowed.add(subItem.href));
        }
    });

    const roleDashboards: { [key: string]: string } = {
        [ROLES.ADMINISTRADOR]: '/dashboard/admin',
        [ROLES.BODEGUERO]: '/dashboard/bodeguero',
        [ROLES.SUPERVISOR]: '/dashboard/supervisor',
        [ROLES.JEFE]: '/dashboard/jefe',
    };
    const dashboardPath = roleDashboards[roleName];
    if (dashboardPath) allowed.add(dashboardPath);
    allowed.add('/change-password');
    allowed.add('/');

    return Array.from(allowed);
}

export default async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({ headers: request.headers });
    const pathname = request.nextUrl.pathname;

    const publicPaths = ['/login', '/api/auth', '/_next'];
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

    const roleDashboards: { [key: string]: string } = {
        [ROLES.ADMINISTRADOR]: '/dashboard/admin',
        [ROLES.BODEGUERO]: '/dashboard/bodeguero',
        [ROLES.SUPERVISOR]: '/dashboard/supervisor',
        [ROLES.JEFE]: '/dashboard/jefe',
    };

    // --- Handle Post-Login Redirection from / ---
    if (pathname === '/' && session?.user) {
        const userRole = session.user.rol;
        const dashboardPath = roleDashboards[userRole];
        if (dashboardPath) {
            return NextResponse.redirect(new URL(dashboardPath, request.url));
        }
    }

    if (session?.user) {
        const userRole = session.user.rol;
        const dashboardPath = roleDashboards[userRole];
        const allowedHrefs = getAllowedHrefsForRole(userRole);

        // Check if the current pathname (without query params) is allowed
        const currentPathBase = pathname.split('?')[0]; // Remove query params for comparison

        const isAllowed = allowedHrefs.some(allowedHref => {
            // Special handling for routes like /reportes or /inventario that can have query params
            if (currentPathBase === allowedHref) return true;
            // For report pages, check if the base path matches and the report type is allowed
            if (currentPathBase === '/reportes' && request.nextUrl.searchParams.has('report')) {
                const reportType = request.nextUrl.searchParams.get('report');
                return allowedHrefs.includes(`/reportes?report=${reportType}`);
            }
            if (currentPathBase === '/inventario' && request.nextUrl.searchParams.has('bodegaId')) {
                // If the user has access to /inventario, then /inventario?bodegaId=X should also be allowed
                return allowedHrefs.includes('/inventario');
            }
            return false;
        });

        // If authenticated user tries to access public path (but not /login itself)
        if (isPublicPath && pathname !== '/login') {
            if (dashboardPath) {
                return NextResponse.redirect(new URL(dashboardPath, request.url));
            }
        }

        if (!isAllowed) {
            if (dashboardPath) {
                return NextResponse.redirect(new URL(dashboardPath, request.url));
            }
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }

        return NextResponse.next();
    } else {
        if (!isPublicPath) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js).*)',
    ],
};