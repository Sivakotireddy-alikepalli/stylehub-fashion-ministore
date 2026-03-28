from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import Cart, Order, OrderItem, User
from app.schemas import OrderResponse
from app.routers.users import get_current_user
from app.invoice_generator import generate_invoice_pdf

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/create", response_model=OrderResponse)
def create_order_from_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart_items = db.query(Cart).options(joinedload(Cart.product)).filter(
        Cart.user_id == current_user.id
    ).all()

    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total_amount = sum(item.quantity * item.product.price for item in cart_items)

    new_order = Order(
        user_id=current_user.id,
        total_amount=total_amount,
        status="pending"
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    for item in cart_items:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.product.price
        )
        db.add(order_item)

    for item in cart_items:
        db.delete(item)

    db.commit()

    created_order = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.product)
    ).filter(Order.id == new_order.id).first()

    return created_order


@router.get("/", response_model=list[OrderResponse])
def get_user_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    orders = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.product)
    ).filter(
        Order.user_id == current_user.id
    ).order_by(Order.id.desc()).all()

    return orders


@router.get("/invoice/{order_id}")
def download_invoice(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    order = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.product)
    ).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    pdf_buffer = generate_invoice_pdf(order)

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=invoice_order_{order.id}.pdf"
        }
    )