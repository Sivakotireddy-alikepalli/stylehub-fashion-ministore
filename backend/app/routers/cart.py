from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import Cart, Product, User
from app.schemas import CartCreate, CartUpdate, CartResponse, CartItemResponse
from app.routers.users import get_current_user

router = APIRouter(prefix="/cart", tags=["Cart"])


@router.post("/add")
def add_to_cart(
    cart_data: CartCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    product = db.query(Product).filter(Product.id == cart_data.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if cart_data.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than 0")

    existing_cart_item = db.query(Cart).filter(
        Cart.user_id == current_user.id,
        Cart.product_id == cart_data.product_id
    ).first()

    if existing_cart_item:
        existing_cart_item.quantity += cart_data.quantity
        db.commit()
        db.refresh(existing_cart_item)
        return {"message": "Cart quantity updated"}

    new_cart_item = Cart(
        user_id=current_user.id,
        product_id=cart_data.product_id,
        quantity=cart_data.quantity
    )

    db.add(new_cart_item)
    db.commit()
    db.refresh(new_cart_item)

    return {"message": "Product added to cart"}


@router.get("/", response_model=CartResponse)
def get_user_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart_items = db.query(Cart).options(joinedload(Cart.product)).filter(
        Cart.user_id == current_user.id
    ).all()

    total_price = sum(item.quantity * item.product.price for item in cart_items)

    return {
        "items": cart_items,
        "total_price": total_price
    }


@router.put("/update/{cart_item_id}")
def update_cart_item(
    cart_item_id: int,
    cart_data: CartUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart_item = db.query(Cart).filter(
        Cart.id == cart_item_id,
        Cart.user_id == current_user.id
    ).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if cart_data.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than 0")

    cart_item.quantity = cart_data.quantity
    db.commit()
    db.refresh(cart_item)

    return {"message": "Cart item updated successfully"}


@router.delete("/remove/{cart_item_id}")
def remove_cart_item(
    cart_item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart_item = db.query(Cart).filter(
        Cart.id == cart_item_id,
        Cart.user_id == current_user.id
    ).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(cart_item)
    db.commit()

    return {"message": "Cart item removed successfully"}