import { NextRequest, NextResponse } from 'next/server';
import { SupabaseOrderStore } from '@/lib/supabase-order-store';
import { requirePermission, Permission } from '@/lib/rbac';

export const GET = requirePermission(Permission.VIEW_ORDERS)(
  async function GET(request: NextRequest) {
    try {
      const orders = await SupabaseOrderStore.getAll();
      
      return NextResponse.json({
        success: true,
        orders: orders,
        count: orders.length
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }
  }
);

export const POST = requirePermission(Permission.CREATE_ORDERS)(
  async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      
      // Create a new order
      const order = await SupabaseOrderStore.create(body);
      
      return NextResponse.json({
        success: true,
        order: order
      });
    } catch (error) {
      console.error('Error creating order:', error);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }
  }
);