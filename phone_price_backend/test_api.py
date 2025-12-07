"""Test API connection"""
import requests

try:
    response = requests.get("http://localhost:8000/api/phones/?skip=0&limit=2")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ API Works! Got {len(data['data'])} phones")
        if data['data']:
            print(f"\nFirst phone: {data['data'][0]['name']}")
            print(f"Brand: {data['data'][0]['brand']}")
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"❌ Connection error: {e}")
