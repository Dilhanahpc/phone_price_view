import requests
import json

BASE_URL = "http://localhost:8000/api"

# Sample comprehensive specifications for different phone types
SAMPLE_SPECS = {
    "flagship": [
        {"key": "display_size", "value": "6.7 inches"},
        {"key": "display_type", "value": "AMOLED, 120Hz"},
        {"key": "resolution", "value": "1440 x 3200 pixels"},
        {"key": "processor", "value": "Snapdragon 8 Gen 2"},
        {"key": "ram", "value": "12GB"},
        {"key": "storage", "value": "256GB / 512GB"},
        {"key": "rear_camera", "value": "50MP + 12MP + 10MP"},
        {"key": "front_camera", "value": "12MP"},
        {"key": "battery", "value": "5000 mAh"},
        {"key": "charging", "value": "45W Fast Charging"},
        {"key": "wireless_charging", "value": "15W"},
        {"key": "operating_system", "value": "Android 14"},
        {"key": "5g_support", "value": "Yes"},
        {"key": "water_resistance", "value": "IP68"},
        {"key": "weight", "value": "228g"},
        {"key": "colors", "value": "Phantom Black, Cream, Green"},
    ],
    "midrange": [
        {"key": "display_size", "value": "6.5 inches"},
        {"key": "display_type", "value": "Super AMOLED, 90Hz"},
        {"key": "resolution", "value": "1080 x 2400 pixels"},
        {"key": "processor", "value": "MediaTek Dimensity 1080"},
        {"key": "ram", "value": "8GB"},
        {"key": "storage", "value": "128GB / 256GB"},
        {"key": "rear_camera", "value": "64MP + 8MP + 2MP"},
        {"key": "front_camera", "value": "32MP"},
        {"key": "battery", "value": "5000 mAh"},
        {"key": "charging", "value": "25W Fast Charging"},
        {"key": "operating_system", "value": "Android 13"},
        {"key": "5g_support", "value": "Yes"},
        {"key": "weight", "value": "195g"},
        {"key": "colors", "value": "Awesome Blue, Awesome Black"},
    ],
    "budget": [
        {"key": "display_size", "value": "6.4 inches"},
        {"key": "display_type", "value": "PLS LCD, 60Hz"},
        {"key": "resolution", "value": "1080 x 2400 pixels"},
        {"key": "processor", "value": "MediaTek Helio G85"},
        {"key": "ram", "value": "4GB / 6GB"},
        {"key": "storage", "value": "64GB / 128GB"},
        {"key": "rear_camera", "value": "50MP + 2MP + 2MP"},
        {"key": "front_camera", "value": "8MP"},
        {"key": "battery", "value": "5000 mAh"},
        {"key": "charging", "value": "15W"},
        {"key": "operating_system", "value": "Android 13"},
        {"key": "4g_support", "value": "Yes"},
        {"key": "weight", "value": "192g"},
        {"key": "colors", "value": "Black, Blue, Green"},
    ],
    "gaming": [
        {"key": "display_size", "value": "6.78 inches"},
        {"key": "display_type", "value": "AMOLED, 165Hz"},
        {"key": "resolution", "value": "1080 x 2448 pixels"},
        {"key": "processor", "value": "Snapdragon 8+ Gen 1"},
        {"key": "gpu", "value": "Adreno 730"},
        {"key": "ram", "value": "16GB"},
        {"key": "storage", "value": "512GB"},
        {"key": "rear_camera", "value": "50MP + 13MP + 2MP"},
        {"key": "front_camera", "value": "16MP"},
        {"key": "battery", "value": "6000 mAh"},
        {"key": "charging", "value": "120W HyperCharge"},
        {"key": "cooling_system", "value": "Vapor Chamber"},
        {"key": "gaming_triggers", "value": "Touch-sensitive shoulder buttons"},
        {"key": "operating_system", "value": "Android 13"},
        {"key": "5g_support", "value": "Yes"},
        {"key": "weight", "value": "238g"},
    ],
    "foldable": [
        {"key": "display_size", "value": "7.6 inches (Unfolded)"},
        {"key": "cover_display", "value": "6.2 inches"},
        {"key": "display_type", "value": "Dynamic AMOLED 2X, 120Hz"},
        {"key": "resolution", "value": "1812 x 2176 pixels"},
        {"key": "processor", "value": "Snapdragon 8 Gen 2"},
        {"key": "ram", "value": "12GB"},
        {"key": "storage", "value": "256GB / 512GB / 1TB"},
        {"key": "rear_camera", "value": "50MP + 12MP + 10MP"},
        {"key": "front_camera", "value": "10MP + 4MP Under Display"},
        {"key": "battery", "value": "4400 mAh"},
        {"key": "charging", "value": "25W Fast Charging"},
        {"key": "wireless_charging", "value": "15W"},
        {"key": "operating_system", "value": "Android 14"},
        {"key": "5g_support", "value": "Yes"},
        {"key": "water_resistance", "value": "IPX8"},
        {"key": "weight", "value": "263g"},
        {"key": "hinge_technology", "value": "Flex Hinge"},
    ]
}

def get_all_phones():
    """Fetch all phones from the API"""
    response = requests.get(f"{BASE_URL}/phones?limit=100")
    if response.status_code == 200:
        return response.json()
    return []

def add_specs_to_phone(phone_id, specs):
    """Add specifications to a phone"""
    response = requests.put(
        f"{BASE_URL}/phones/{phone_id}/specs/bulk",
        json=specs
    )
    return response.status_code == 200

def main():
    print("🔧 Adding sample specifications to phones...")
    
    phones = get_all_phones()
    
    if not phones:
        print("❌ No phones found in database. Please add phones first.")
        return
    
    for phone in phones:
        category = phone.get('category', 'midrange')
        specs = SAMPLE_SPECS.get(category, SAMPLE_SPECS['midrange'])
        
        # Add some phone-specific specs
        custom_specs = specs.copy()
        
        print(f"\n📱 Adding specs to: {phone['brand']} {phone['model']}")
        
        if add_specs_to_phone(phone['id'], custom_specs):
            print(f"   ✅ Added {len(custom_specs)} specifications")
        else:
            print(f"   ❌ Failed to add specifications")
    
    print("\n✨ Done! Specifications have been added to all phones.")
    print("🌐 You can now view detailed specs on the phone details page!")

if __name__ == "__main__":
    main()
