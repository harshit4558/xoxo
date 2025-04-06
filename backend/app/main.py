from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
from aipolabs import ACI
import logging
import json

load_dotenv()
openai = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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"
)

# Initialize ACI client for MCP server
aci = ACI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Vibe Agent API",
    description="Backend API for Vibe Agent Chrome Extension",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins temporarily for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for credentials (replace with database in production)
stored_credentials = {}

class LinkedInCredentials(BaseModel):
    username: str
    password: str
    domain: str = "linkedin.com"

@app.post("/api/credentials/linkedin")
async def save_linkedin_credentials(credentials: LinkedInCredentials, request: Request):
    try:
        client_host = request.client.host
        logger.info(f"Received credential save request from: {client_host}")
        logger.info(f"Credentials received for username: {credentials.username}")
        
        # Get the function definition for storing credentials from MCP server
        safe_cred_definition = aci.functions.get_definition("AIPOLABS_SECRETS_MANAGER__CREATE_CREDENTIAL_FOR_DOMAIN")
        logger.info(f"Retrieved function definition from MCP server")
        
        # Create a completion that will use tool calling via OpenAI
        logger.info(f"Calling OpenAI with tool definition for domain: {credentials.domain}")
        response = openai.chat.completions.create(
            model="google/gemini-2.5-pro-exp-03-25:free",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that securely stores credentials."
                },
                {
                    "role": "user",
                    "content": f"Store these credentials securely using the provided tool. Username: {credentials.username}, Domain: {credentials.domain}, Password: [SECURE_PASSWORD]"
                }
            ],
            tools=[safe_cred_definition],
            tool_choice={"type": "function", "function": {"name": "AIPOLABS_SECRETS_MANAGER__CREATE_CREDENTIAL_FOR_DOMAIN"}}
        )
        
        # Check if we have tool calls in the response
        if (not hasattr(response.choices[0].message, 'tool_calls') or 
            response.choices[0].message.tool_calls is None or 
            len(response.choices[0].message.tool_calls) == 0):
            
            logger.error("No tool calls found in the OpenAI response")
            raise HTTPException(status_code=500, detail="Failed to generate tool call")
        
        # Get tool call info from the response
        tool_call = response.choices[0].message.tool_calls[0]
        logger.info(f"Tool call received - Name: {tool_call.function.name}")
        
        # Extract the function arguments from the tool call
        function_args = json.loads(tool_call.function.arguments)
        logger.info(f"Function arguments received (credentials redacted)")
        
        # Execute the function with ACI to store credentials securely
        logger.info("Executing function with ACI to store credentials securely")
        aci_response = aci.handle_function_call(
            tool_call.function.name,
            function_args,
            linked_account_owner_id="default"
        )
        logger.info(f"Credentials stored securely in MCP server")
        
        # For local tracking (only store non-sensitive data)
        stored_credentials["linkedin"] = {
            "username": credentials.username,
            "password": "[REDACTED]",  # Don't log actual password
            "domain": credentials.domain
        }
        
        return {
            "status": "success",
            "message": "Credentials stored securely in MCP server",
            "stored_for_domain": credentials.domain,
            "tool_call_id": tool_call.id
        }
    except Exception as e:
        logger.error(f"Error storing credentials: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

class OAuthRequest(BaseModel):
    redirect_url: str = None

@app.get("/")
async def root():
    logger.info("Root endpoint accessed")
    return {
        "message": "Welcome to Vibe Agent API",
        "status": "active",
        "version": "1.0.0"
    }

@app.post("/api/oauth/initiate")
async def initiate_oauth(request: OAuthRequest = None):
    """Initiate the OAuth flow"""
    try:
        logger.info("OAuth initiation requested")
        
        # Here you would implement your actual OAuth logic
        # For now, just return a mock response
        return {
            "status": "success",
            "message": "OAuth flow initiated",
            "oauth_url": "https://example.com/oauth/authorize?client_id=your_client_id"
        }
    except Exception as e:
        logger.error(f"Error initiating OAuth: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 