from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class AdminLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str


class ProductResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    image_url: str | None = None
    category: str
    stock: int

    class Config:
        from_attributes = True


class CartCreate(BaseModel):
    product_id: int
    quantity: int


class CartUpdate(BaseModel):
    quantity: int


class CartItemResponse(BaseModel):
    id: int
    quantity: int
    product: ProductResponse

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    items: list[CartItemResponse]
    total_price: float


class OrderItemResponse(BaseModel):
    id: int
    quantity: int
    price: float
    product: ProductResponse

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    total_amount: float
    status: str
    payment_intent_id: str | None = None
    items: list[OrderItemResponse]

    class Config:
        from_attributes = True


class PaymentIntentResponse(BaseModel):
    client_secret: str
    payment_intent_id: str
    order_id: int


class PaymentStatusUpdate(BaseModel):
    status: str


class CouponApplyRequest(BaseModel):
    code: str
    total_amount: float


class CouponApplyResponse(BaseModel):
    coupon_code: str
    original_total: float
    discount_percent: float
    discount_amount: float
    final_total: float