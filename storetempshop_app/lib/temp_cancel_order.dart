@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def cancel_order_item(request, order_item_id):
    from account.models import OrderItem
    
    try:
        shopkeeper = get_object_or_404(Shopkeeper, id=request.user.id)
        order_item = get_object_or_404(OrderItem, id=order_item_id, shopkeeper=shopkeeper)
        
        # Check if order can be cancelled
        if order_item.order.status in ['shipped', 'delivered', 'cancelled']:
            return Response(
                {'error': f'Cannot cancel order with status: {order_item.order.status}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update order status to cancelled
        order_item.order.status = 'cancelled'
        order_item.order.save()
        
        return Response(
            {'message': 'Order cancelled successfully', 'status': 'cancelled'},
            status=status.HTTP_200_OK
        )
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )