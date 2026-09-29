import boto3
import json

# Using the Haiku 4.5 ID we saw in your terminal earlier
MODEL_ID = "us.anthropic.claude-3-5-haiku-20241022-v1:0"

client = boto3.client("bedrock-runtime", region_name="us-east-1")

print(f"Testing connection to {MODEL_ID}...")

try:
    response = client.converse(
        modelId=MODEL_ID,
        messages=[{"role": "user", "content": [{"text": "Say 'Perfume Bot Active' if you can hear me."}]}]
    )
    print("SUCCESS!")
    print("AI Response:", response["output"]["message"]["content"][0]["text"])

except Exception as e:
    print("\n--- ERROR ---")
    print(str(e))
    print("-------------\n")