from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine, SessionLocal
from app.routers import users, products, cart, orders, payment, coupons, admin
from app.seed_data import seed_products, seed_coupons, seed_admin
from app.auth import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

Base.metadata.create_all(bind=engine)

app = FastAPI(title="StyleHub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(payment.router)
app.include_router(coupons.router)
app.include_router(admin.router)


@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        seed_products(db)
        seed_coupons(db)
        seed_admin(db)
    finally:
        db.close()


@app.get("/")
def home():
    return {"message": "Welcome to StyleHub API"}


@app.get("/debug/env")
def debug_env():
    return {
        "secret_loaded": bool(SECRET_KEY),
        "algorithm": ALGORITHM,
        "expire_minutes": ACCESS_TOKEN_EXPIRE_MINUTES
    }


@app.get("/debug/time")
def debug_time():
    now = datetime.now(timezone.utc)
    return {
        "utc_now": now.isoformat(),
        "utc_timestamp": int(now.timestamp())
    }