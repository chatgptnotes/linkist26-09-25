import { NextRequest, NextResponse } from 'next/server';
import { SupabaseOrderStore, type OrderStatus } from '@/lib/supabase-order-store';
import { requirePermission, Permission } from '@/lib/rbac';

export const PATCH = requirePermission(Permission.UPDATE_ORDERS)(
  async function PATCH(
    request: NextRequest,
    user: any,
    { params }: { params: { id: string } } = { params: { id: '' } }
  ) {
    try {
      const { status } = await request.json();
      const orderId = params.id;

      if (!status || !['pending', 'confirmed', 'production', 'shipped', 'delivered', 'cancelled'].includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status provided' },
          { status: 400 }
        );
      }

      const updatedOrder = await SupabaseOrderStore.updateStatus(orderId, status as OrderStatus);
      
      if (!updatedOrder) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        order: updatedOrder
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 500 }
      );
    }
  }
);