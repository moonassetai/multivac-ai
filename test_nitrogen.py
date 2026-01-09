"""
Test script for NitroGen inference server
"""
import numpy as np
from nitrogen.inference_client import ModelClient
from PIL import Image

def test_nitrogen_server():
    """Test connection to NitroGen server and basic inference."""
    
    print("=" * 60)
    print("NitroGen Server Test")
    print("=" * 60)
    
    try:
        # Connect to server
        print("\n1. Connecting to server at localhost:5555...")
        client = ModelClient(host="localhost", port=5555)
        print("   ✓ Connected successfully!")
        
        # Get server info
        print("\n2. Getting server info...")
        info = client.info()
        print(f"   ✓ Server info: {info}")
        
        # Create a test image (random noise for now)
        print("\n3. Creating test image (1440x2560 RGB)...")
        test_image = np.random.randint(0, 255, (1440, 2560, 3), dtype=np.uint8)
        print(f"   ✓ Test image shape: {test_image.shape}")
        
        # Test prediction
        print("\n4. Sending image for prediction...")
        result = client.predict(test_image)
        print(f"   ✓ Prediction received!")
        print(f"   Result keys: {result.keys()}")
        
        # Display prediction details
        if 'j_left' in result:
            print(f"\n5. Prediction Details:")
            print(f"   Left Joystick: {result.get('j_left')}")
            print(f"   Right Joystick: {result.get('j_right')}")
            print(f"   Buttons: {result.get('buttons')}")
        
        # Test reset
        print("\n6. Testing session reset...")
        client.reset()
        print("   ✓ Session reset successful!")
        
        # Close connection
        print("\n7. Closing connection...")
        client.close()
        print("   ✓ Connection closed!")
        
        print("\n" + "=" * 60)
        print("✅ All tests passed! NitroGen server is working correctly.")
        print("=" * 60)
        
        return True
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_nitrogen_server()
    exit(0 if success else 1)
