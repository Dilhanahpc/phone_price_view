from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import phones, shops, prices, search, ai_predict, subscribers, reviews

app = FastAPI(
    title="Phone Price Backend API",
    description="API for tracking and predicting phone prices across different shops",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(phones.router, prefix="/api/phones", tags=["Phones"])
app.include_router(shops.router, prefix="/api/shops", tags=["Shops"])
app.include_router(prices.router, prefix="/api/prices", tags=["Prices"])
app.include_router(search.router, prefix="/api/search", tags=["Search"])
app.include_router(ai_predict.router, prefix="/api/ai", tags=["AI Predictions"])
app.include_router(subscribers.router)
app.include_router(reviews.router)

@app.get("/")
async def root():
    return {"message": "Phone Price Backend API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
