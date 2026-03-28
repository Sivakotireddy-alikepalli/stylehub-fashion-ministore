from collections import defaultdict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func

from app.database import get_db
from app.models import Product, Order, OrderItem, Coupon, User
from app.routers.users import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/dashboard")
def admin_dashboard(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    total_products = db.query(Product).count()
    total_orders = db.query(Order).count()
    total_users = db.query(User).count()
    total_coupons = db.query(Coupon).count()

    total_revenue = db.query(func.sum(Order.total_amount)).filter(
        Order.status == "paid"
    ).scalar()

    if total_revenue is None:
        total_revenue = 0

    low_stock_products = db.query(Product).filter(Product.stock <= 10).all()

    top_selling_query = (
        db.query(
            Product.name,
            func.sum(OrderItem.quantity).label("total_sold")
        )
        .join(OrderItem, Product.id == OrderItem.product_id)
        .join(Order, Order.id == OrderItem.order_id)
        .filter(Order.status == "paid")
        .group_by(Product.id, Product.name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(5)
        .all()
    )

    top_selling_products = [
        {"name": row.name, "total_sold": int(row.total_sold or 0)}
        for row in top_selling_query
    ]

    recent_orders_query = (
        db.query(Order)
        .options(joinedload(Order.user), joinedload(Order.items).joinedload(OrderItem.product))
        .order_by(Order.id.desc())
        .limit(5)
        .all()
    )

    recent_orders = [
        {
            "id": order.id,
            "user_email": order.user.email if order.user else "",
            "status": order.status,
            "total_amount": order.total_amount,
            "items_count": len(order.items)
        }
        for order in recent_orders_query
    ]

    paid_orders = (
        db.query(Order)
        .filter(Order.status == "paid")
        .order_by(Order.id.asc())
        .all()
    )

    revenue_trend = []
    running_total = 0
    for order in paid_orders:
        running_total += order.total_amount
        revenue_trend.append({
            "label": f"Order {order.id}",
            "revenue": running_total
        })

    overview_chart = [
        {"label": "Orders", "value": total_orders},
        {"label": "Revenue", "value": total_revenue},
        {"label": "Users", "value": total_users},
        {"label": "Products", "value": total_products},
    ]

    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "total_users": total_users,
        "total_coupons": total_coupons,
        "total_revenue": total_revenue,
        "low_stock_products": [
            {
                "id": product.id,
                "name": product.name,
                "stock": product.stock,
                "category": product.category,
                "price": product.price,
                "image_url": product.image_url,
            }
            for product in low_stock_products
        ],
        "top_selling_products": top_selling_products,
        "recent_orders": recent_orders,
        "overview_chart": overview_chart,
        "revenue_trend": revenue_trend
    }


@router.get("/products")
def get_admin_products(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return db.query(Product).order_by(Product.id.desc()).all()


@router.post("/products")
def create_product(
    product_data: dict,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    new_product = Product(
        name=product_data["name"],
        description=product_data["description"],
        price=product_data["price"],
        image_url=product_data.get("image_url"),
        category=product_data["category"],
        stock=product_data["stock"]
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return {"message": "Product created successfully", "product": new_product}


@router.put("/products/{product_id}")
def update_product(
    product_id: int,
    product_data: dict,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.name = product_data["name"]
    product.description = product_data["description"]
    product.price = product_data["price"]
    product.image_url = product_data.get("image_url")
    product.category = product_data["category"]
    product.stock = product_data["stock"]

    db.commit()
    db.refresh(product)

    return {"message": "Product updated successfully", "product": product}


@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}


@router.get("/orders")
def get_admin_orders(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return (
        db.query(Order)
        .options(
            joinedload(Order.items).joinedload(OrderItem.product),
            joinedload(Order.user)
        )
        .order_by(Order.id.desc())
        .all()
    )


@router.put("/orders/{order_id}")
def update_admin_order_status(
    order_id: int,
    data: dict,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    allowed_statuses = ["pending", "paid", "failed", "cancelled"]
    if data["status"] not in allowed_statuses:
        raise HTTPException(status_code=400, detail="Invalid order status")

    order.status = data["status"]
    db.commit()
    db.refresh(order)

    return {"message": "Order status updated successfully", "order": order}


@router.get("/coupons")
def get_admin_coupons(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return db.query(Coupon).order_by(Coupon.id.desc()).all()


@router.post("/coupons")
def create_coupon(
    data: dict,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    existing_coupon = db.query(Coupon).filter(
        Coupon.code == data["code"].upper()
    ).first()

    if existing_coupon:
        raise HTTPException(status_code=400, detail="Coupon already exists")

    coupon = Coupon(
        code=data["code"].upper(),
        discount_percent=data["discount_percent"],
        is_active=data.get("is_active", 1)
    )

    db.add(coupon)
    db.commit()
    db.refresh(coupon)

    return {"message": "Coupon created successfully", "coupon": coupon}