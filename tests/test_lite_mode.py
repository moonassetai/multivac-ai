import sys
import os
import pytest
from unittest.mock import MagicMock, patch

# Ensure backend can be imported
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

@pytest.fixture(autouse=True)
def clean_imports():
    sys.modules.pop('backend.brain_lite', None)
    yield

def test_brain_lite_initialization():
    with patch('google.genai.Client') as mock_client:
        from backend.brain_lite import LiteLoop
        loop = LiteLoop()
        assert loop.cad_agent is not None

@pytest.mark.asyncio
async def test_lite_process_text():
    # Import first to get the module
    # We need to mock Client BEFORE import or patch the module attribute AFTER import

    with patch('google.genai.Client') as MockClient:
        # Configure the mock instance
        mock_instance = MockClient.return_value

        # Mock async generate_content
        async def async_return(*args, **kwargs):
            mock_response = MagicMock()
            mock_candidate = MagicMock()
            mock_part = MagicMock()
            mock_part.text = "Hello from Lite AI"
            mock_part.function_call = None
            mock_candidate.content.parts = [mock_part]
            mock_response.candidates = [mock_candidate]
            return mock_response

        # Important: client.aio.models.generate_content needs to be the async function
        mock_instance.aio.models.generate_content.side_effect = async_return

        from backend.brain_lite import LiteLoop

        loop = LiteLoop()
        response = await loop.process_text("Hello")

        assert "Hello from Lite AI" in response
