import os
import stripe
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from dotenv import load_dotenv

from app.database import get_db
from app.models import Order, User, OrderItem
from app.schemas import PaymentStatusUpdate
from app.routers.users import get_current_user
from app.invoice_generator import generate_invoice_pdf
from app.email_utils import send_invoice_email

load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

router = APIRouter(prefix="/payment", tags=["Payment"])


@router.post("/create-checkout-session/{order_id}")
def create_checkout_session(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.total_amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid order amount")

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            line_items=[
                {
                    "price_data": {
                        "currency": "inr",
                        "product_data": {
                            "name": f"Order #{order.id}",
                        },
                        "unit_amount": int(order.total_amount * 100),
                    },
                    "quantity": 1,
                }
            ],
            success_url=f"http://localhost:5173/payment-success?order_id={order.id}",
            cancel_url=f"http://localhost:5173/payment-cancel?order_id={order.id}",
            metadata={
                "order_id": str(order.id),
                "user_id": str(current_user.id),
            },
        )

        order.payment_intent_id = session.id
        db.commit()
        db.refresh(order)

        return {
            "checkout_url": session.url,
            "order_id": order.id
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/update-status/{order_id}")
def update_payment_status(
    order_id: int,
    payment_data: PaymentStatusUpdate,
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

    allowed_statuses = ["pending", "paid", "failed", "cancelled"]
    if payment_data.status not in allowed_statuses:
        raise HTTPException(status_code=400, detail="Invalid payment status")

    order.status = payment_data.status
    db.commit()
    db.refresh(order)

    email_sent = False

    if payment_data.status == "paid":
        try:
            pdf_buffer = generate_invoice_pdf(order)
            email_sent = send_invoice_email(current_user.email, order.id, pdf_buffer)
        except Exception as e:
            print("Invoice email error:", e)

    return {
        "message": "Order status updated successfully",
        "order_id": order.id,
        "new_status": order.status,
        "invoice_email_sent": email_sent
    }