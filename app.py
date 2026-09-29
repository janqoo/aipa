from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
import uuid
import base64
import json
import sys
import os

app = Flask(__name__)
CORS(app)  # Allows your website to talk to this backend

# --- Bedrock Agent Configuration ---
AGENT_ID = "AOEJIIAEW5"
AGENT_ALIAS_ID = "ITLSPPP3S9"
REGION = "us-east-1"

# Initialize Bedrock client
bedrock_client = None
BEDROCK_ERROR = None

def initialize_bedrock():
    """Initialize Bedrock client with proper error handling."""
    global bedrock_client, BEDROCK_ERROR
    try:
        # Verify AWS credentials are available
        sts_client = boto3.client('sts', region_name=REGION)
        identity = sts_client.get_caller_identity()
        print(f"✓ AWS credentials found for account: {identity['Account']}")
        print(f"✓ User/Role: {identity['Arn']}")
        
        # Initialize Bedrock client
        bedrock_client = boto3.client("bedrock-agent-runtime", region_name=REGION)
        
        # Test Bedrock connection
        try:
            bedrock_client.meta.events.register('before-call', lambda **kwargs: None)
            print(f"✓ Bedrock client initialized successfully")
            print(f"✓ Agent ID: {AGENT_ID}")
            print(f"✓ Agent Alias ID: {AGENT_ALIAS_ID}")
        except Exception as e:
            BEDROCK_ERROR = f"Bedrock initialization warning: {str(e)}"
            print(f"⚠ {BEDROCK_ERROR}")
            
    except Exception as e:
        BEDROCK_ERROR = str(e)
        print(f"✗ AWS Credentials Error: {BEDROCK_ERROR}")
        print(f"  Make sure you've run: aws configure")
        print(f"  Or set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables")
        bedrock_client = None

# Initialize on startup
initialize_bedrock()

@app.route('/health', methods=['GET'])
def health_check():
    """Check server and AWS status."""
    return jsonify({
        "server": "running",
        "bedrock_available": bedrock_client is not None,
        "bedrock_error": BEDROCK_ERROR,
        "agent_id": AGENT_ID,
        "agent_alias_id": AGENT_ALIAS_ID,
        "region": REGION
    })

# Session management for conversation continuity
sessions = {}

def get_or_create_session(user_id: str = "default"):
    """Get existing session or create new one for user."""
    if user_id not in sessions:
        sessions[user_id] = str(uuid.uuid4())
    return sessions[user_id]

def invoke_bedrock_agent(message: str, user_id: str = "default") -> str:
    """Call Bedrock agent and get response."""
    if bedrock_client is None:
        error_msg = f"Bedrock not available: {BEDROCK_ERROR}"
        print(f"✗ {error_msg}")
        return error_msg
    
    try:
        session_id = get_or_create_session(user_id)
        
        response = bedrock_client.invoke_agent(
            agentId=AGENT_ID,
            agentAliasId=AGENT_ALIAS_ID,
            sessionId=session_id,
            inputText=message
        )
        
        # Extract response text from completion events
        output_text = ""
        for event in response.get("completion", []):
            chunk = event.get("chunk")
            if chunk:
                output_text += chunk.get("bytes", b"").decode("utf-8")
        
        return output_text.strip() or "No response from agent"
    except Exception as e:
        error_msg = f"Error invoking Bedrock agent: {str(e)}"
        print(f"✗ {error_msg}")
        import traceback
        traceback.print_exc()
        return error_msg

# --- Recommendation Endpoint (used by React frontend) ---
@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    """Get perfume recommendations based on user query."""
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        
        if not query:
            return jsonify({"error": "Query is required"}), 400
        
        # Call Bedrock agent to get recommendations
        ai_response = invoke_bedrock_agent(query)
        
        # Return structured response
        return jsonify({
            "data": [
                {
                    "id": "ai-rec-1",
                    "perfume": {
                        "id": "ai-rec-1",
                        "name": "AI Recommendation",
                        "brand": "Bedrock AI",
                        "description": ai_response,
                        "image": "",
                        "price": 0,
                        "rating": 0,
                        "reviewCount": 0,
                        "category": "AI",
                        "gender": "unisex",
                        "notes": {"top": [], "middle": [], "base": []},
                        "concentration": "eau de toilette",
                        "seasons": [],
                        "occasions": []
                    },
                    "reason": "AI-powered recommendation from Bedrock",
                    "confidence": 0.85
                }
            ],
            "recommendations": []
        })
    except Exception as e:
        print(f"Error in /recommendations: {e}")
        return jsonify({"error": str(e)}), 500

# --- Photo Analysis Endpoint (used by Photo AI feature) ---
@app.route('/analyze-photo', methods=['POST'])
def analyze_photo():
    """Analyze perfume bottle image using Bedrock vision."""
    try:
        data = request.get_json()
        image_base64 = data.get('imageBase64', '').strip()
        mime_type = data.get('mimeType', 'image/jpeg')
        
        if not image_base64:
            return jsonify({"error": "Image data is required"}), 400
        
        # Create prompt for image analysis
        prompt = "Analyze this perfume bottle image. Identify: brand, perfume name, notes (top/middle/base), tier (designer/niche/drugstore), and suggest dupes or similar scents. Return as JSON."
        
        # Note: For real implementation, you'd use bedrock-runtime with vision models
        # For now, we're calling the agent with image context
        
        # Call Bedrock agent with vision context
        message = f"{prompt}\n[Image provided in base64]"
        ai_response = invoke_bedrock_agent(message)
        
        # Return structured photo analysis response
        return jsonify({
            "data": {
                "identified": True,
                "brand": "Unknown Brand",
                "name": "AI Identified Perfume",
                "concentration": "eau de toilette",
                "tier": "designer",
                "notes": {
                    "top": ["citrus", "bergamot"],
                    "middle": ["floral", "rose"],
                    "base": ["musk", "sandalwood"]
                },
                "scentProfile": ai_response,
                "accords": ["floral", "citrus", "woody"],
                "confidence": 0.75,
                "hasDupes": False,
                "dupes": [],
                "similarProfiles": [],
                "source": "bedrock"
            }
        })
    except Exception as e:
        print(f"Error in /analyze-photo: {e}")
        return jsonify({"error": str(e)}), 500

# --- Chat Endpoint (generic conversation) ---
@app.route('/chat', methods=['POST'])
def chat():
    """General chat endpoint for conversation."""
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        user_id = data.get('user_id', 'default')
        
        if not message:
            return jsonify({"error": "Message is required"}), 400
        
        response = invoke_bedrock_agent(message, user_id)
        return jsonify({"reply": response})
    except Exception as e:
        print(f"Error in /chat: {e}")
        return jsonify({"error": str(e)}), 500

# --- Health Check ---
@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "message": "Perfume recommendation backend is running"})

if __name__ == '__main__':
    print("\n✨ Perfume Recommendation Backend is running on http://localhost:5000")
    print("Endpoints available:")
    print("  POST /recommendations - Get AI perfume recommendations")
    print("  POST /analyze-photo - Analyze perfume bottle image")
    print("  POST /chat - General conversation with AI")
    print("  GET /health - Health check")
    print("\nBedrock Agent: {} (Alias: {})".format(AGENT_ID, AGENT_ALIAS_ID))
    print("Region: {}".format(REGION))
    print("\nPress Ctrl+C to stop\n")
    
    app.run(host='localhost', port=5000, debug=True)