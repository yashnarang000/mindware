import uvicorn
import os

if __name__ == "__main__":
    # Get port from environment variable or default to 8001
    port = int(os.environ.get("CHAT_PORT", 8001))
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        reload_dirs=["."],
        reload_includes=["*.py"],
    )