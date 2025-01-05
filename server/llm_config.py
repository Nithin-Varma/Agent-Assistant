from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.embeddings.ollama import OllamaEmbedding
from llama_index.llms.openai import OpenAI
from llama_index.llms.ollama import Ollama
from llama_index.core import Settings
from app_settings import settings

# Configure the LLM settings
if settings.USE_OLLAMA:
    Settings.llm = Ollama(base_url=settings.OLLAMA_ENDPOINT, model=settings.OLLAMA_MODEL)
    Settings.embed_model = OllamaEmbedding(base_url=settings.OLLAMA_ENDPOINT, model_name=settings.OLLAMA_MODEL)
else:
    Settings.llm = OpenAI(model=settings.OPENAI_MODEL, api_key=settings.OPENAI_API_KEY)
    Settings.embed_model = OpenAIEmbedding(model_=settings.OPENAI_EMBEDDING_MODEL, api_key=settings.OPENAI_API_KEY)
