from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from app.routes import phones, shops, prices, search, ai_predict, subscribers, reviews

app = FastAPI(
    title="Phone Price Backend API",
    description="API for tracking and predicting phone prices across different shops",
    version="1.0.0",
    root_path=""
)

# Middleware to handle Railway proxy headers and enforce HTTPS
class HTTPSRedirectMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        # Get the X-Forwarded-Proto header from Railway proxy
        forwarded_proto = request.headers.get("x-forwarded-proto", "")
        
        # Force HTTPS scheme in the request
        if forwarded_proto == "http":
            # Update the request scope to use HTTPS
            request.scope["scheme"] = "https"
        
        response = await call_next(request)
        
        # Add security headers
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        
        return response

# Add HTTPS redirect middleware FIRST
app.add_middleware(HTTPSRedirectMiddleware)

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
