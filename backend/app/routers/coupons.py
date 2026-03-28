from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Coupon
from app.schemas import CouponApplyRequest, CouponApplyResponse

router = APIRouter(prefix="/coupons", tags=["Coupons"])


@router.post("/apply", response_model=CouponApplyResponse)
def apply_coupon(data: CouponApplyRequest, db: Session = Depends(get_db)):
    coupon = db.query(Coupon).filter(
        Coupon.code == data.code.upper(),
        Coupon.is_active == 1
    ).first()

    if not coupon:
        raise HTTPException(status_code=404, detail="Invalid or inactive coupon")

    discount_amount = (data.total_amount * coupon.discount_percent) / 100
    final_total = data.total_amount - discount_amount

    return {
        "coupon_code": coupon.code,
        "original_total": data.total_amount,
        "discount_percent": coupon.discount_percent,
        "discount_amount": discount_amount,
        "final_total": final_total
    }