"""
Test script for rate limiting functionality
Run: python Scripts/test_rate_limiting.py
"""
import requests
import time

BASE_URL = "http://localhost:8000/api"

def test_login_throttle():
    """Test login endpoint throttling (5/hour)"""
    print("\n🔐 Testing Login Rate Limiting (5/hour)...")
    
    for i in range(7):
        response = requests.post(
            f"{BASE_URL}/auth/login/",
            json={"username": "test", "password": "wrong"}
        )
        print(f"Attempt {i+1}: Status {response.status_code}")
        
        if response.status_code == 429:
            print("✅ Rate limit working! Request throttled.")
            return True
        time.sleep(0.5)
    
    print("❌ Rate limit not triggered")
    return False

def test_register_throttle():
    """Test registration endpoint throttling (3/hour)"""
    print("\n📝 Testing Registration Rate Limiting (3/hour)...")
    
    for i in range(5):
        response = requests.post(
            f"{BASE_URL}/auth/register/",
            json={
                "username": f"test{i}",
                "email": f"test{i}@test.com",
                "password": "testpass123"
            }
        )
        print(f"Attempt {i+1}: Status {response.status_code}")
        
        if response.status_code == 429:
            print("✅ Rate limit working! Request throttled.")
            return True
        time.sleep(0.5)
    
    print("❌ Rate limit not triggered")
    return False

if __name__ == "__main__":
    print("=" * 50)
    print("🛡️  Rate Limiting Test Suite")
    print("=" * 50)
    
    try:
        test_login_throttle()
        test_register_throttle()
        
        print("\n" + "=" * 50)
        print("✅ Rate limiting tests completed!")
        print("=" * 50)
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Cannot connect to server.")
        print("Make sure Django server is running on http://localhost:8000")
