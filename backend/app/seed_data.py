from sqlalchemy.orm import Session
from app.models import Product, Coupon, User
from app.auth import hash_password


def seed_products(db: Session):
    existing_products = db.query(Product).count()

    if existing_products == 0:
        sample_products = [
            Product(
                name="Classic Black T-Shirt",
                description="Soft cotton black t-shirt for daily wear",
                price=499.0,
                image_url="/images/tshirt.jpg",
                category="T-Shirts",
                stock=20
            ),
            Product(
                name="Blue Denim Jeans",
                description="Slim fit blue denim jeans",
                price=1299.0,
                image_url="/images/jeans.jpg",
                category="Jeans",
                stock=15
            ),
            Product(
                name="White Sneakers",
                description="Stylish white sneakers for casual outfits",
                price=1999.0,
                image_url="/images/sneakers.jpg",
                category="Footwear",
                stock=10
            ),
            Product(
                name="Grey Hoodie",
                description="Warm grey hoodie with front pocket",
                price=999.0,
                image_url="/images/hoodie.jpg",
                category="Hoodies",
                stock=8
            ),
            Product(
                name="Leather Jacket",
                description="Trendy brown leather jacket",
                price=2499.0,
                image_url="/images/jacket.jpg",
                category="Jackets",
                stock=5
            )
        ]

        db.add_all(sample_products)
        db.commit()


def seed_coupons(db: Session):
    existing_coupons = db.query(Coupon).count()

    if existing_coupons == 0:
        sample_coupons = [
            Coupon(code="SAVE10", discount_percent=10, is_active=1),
            Coupon(code="SAVE20", discount_percent=20, is_active=1),
            Coupon(code="NEWUSER15", discount_percent=15, is_active=1),
        ]

        db.add_all(sample_coupons)
        db.commit()


def seed_admin(db: Session):
    existing_admin = db.query(User).filter(User.email == "admin@stylehub.com").first()

    if not existing_admin:
        admin_user = User(
            username="Admin",
            email="admin@stylehub.com",
            password=hash_password("admin123"),
            role="admin"
        )
        db.add(admin_user)
        db.commit()