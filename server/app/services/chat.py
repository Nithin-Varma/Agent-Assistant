
from pydantic import BaseModel
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, ServiceContext, StorageContext, load_index_from_storage
from llama_index.llms.ollama import Ollama

from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.embeddings.ollama import OllamaEmbedding

from llama_index.llms.openai import OpenAI
from llama_index.core.agent import ReActAgent
from llama_index.core.tools import FunctionTool
from llama_index.core import Settings

import requests
import pandas as pd
import dateparser
from datetime import datetime

# Import settings
from app.settings import settings

# Function to fetch 16-day weather forecast
def get_weather_forecast(city_name):
    """
    Fetches a 16-day weather forecast for the specified city.

    Args:
        city_name (str): The name of the city to get the forecast for.

    Returns:
        pd.DataFrame or str: A DataFrame containing the forecast data if successful,
                             or an error message string if not.
    """
    city_service = CitySearchService()
    forecast_city_page = city_service.find_file_for_city(city=city_name)
    
    if forecast_city_page is None:
        return "No forecast available for the specified city."
    
    forecast_url = f"https://www.wetter.com/wetter_aktuell/wettervorhersage/16_tagesvorhersage/{forecast_city_page}"
    forecaster = SixteenDayWeatherForecastService(forecast_city_page)
    response = forecaster.fetch_weather_data()
    response = [i.model_dump() for i in response]
    
    if not response:
        return "Weather data not available at the moment."
    
    forecast_data = {
        "date": pd.to_datetime([entry['date'] for entry in response]),
        "weather_state": [entry['weather_state'] for entry in response],
        "temp_max": [entry['temp_max'] for entry in response],
        "temp_min": [entry['temp_min'] for entry in response],
        "precipitation_chance": [entry['precipitation_chance'] for entry in response],
        "precipitation_amount": [entry['precipitation_amount'] for entry in response]
    }
    
    forecast_df = pd.DataFrame(forecast_data)
    return forecast_df

# Tool to extract and parse natural language dates
def extract_date_from_text(date_text):
    """
    Parses a natural language date string into a datetime object.

    Args:
        date_text (str): The date in natural language (e.g., "tomorrow", "next Monday").

    Returns:
        datetime or None: The parsed datetime object if successful, or None if parsing fails.
    """
    parsed_date = dateparser.parse(date_text)
    if parsed_date:
        return pd.to_datetime(parsed_date.date())
    else:
        return None

# Function to get weather for a natural date
def get_weather_for_natural_date(city: str, date_text: str):
    """
    Fetches the weather forecast for a given city and natural language date.

    Args:
        city (str): The name of the city to get the weather forecast for.
        date_text (str): The date in natural language (e.g., "tomorrow", "next Monday").

    Returns:
        dict or str: A dictionary containing weather details and a summary if successful,
                     or an error message string if not.
    """
    # Parse the natural language date into a datetime object
    target_date = extract_date_from_text(date_text)
    
    if not target_date:
        # Return an error message if the date could not be parsed
        return f"Could not understand the date '{date_text}'."
    
    # Fetch the weather forecast data for the specified city
    forecast_df = get_weather_forecast(city)
    
    if isinstance(forecast_df, str):  # If an error message is returned
        # Return the error message from get_weather_forecast
        return forecast_df
    
    # Check if the target date is within the forecast range
    day_forecast = forecast_df[forecast_df['date'].dt.date == target_date.date()]
    if len(day_forecast) > 0:
        # Get the forecast data for the target date
        day_forecast = day_forecast.iloc[0]
    
        temperature = day_forecast['temp_max']
        precipitation_chance = day_forecast['precipitation_chance']
        precipitation_amount = day_forecast['precipitation_amount']
        weather_state = day_forecast['weather_state']
    
        # Create a summary of the weather forecast
        summary = (f"The weather forecast for {city} on {target_date.strftime('%Y-%m-%d')} is "
                   f"{temperature:.1f}°C with {precipitation_chance:.1f}% chance of precipitation and {precipitation_amount:.1f} mm of rainfall. The state is {weather_state}.")
        
        # Return the forecast data as a dictionary
        result = {
            "temperature": temperature,
            "precipitation_chance": precipitation_chance,
            "precipitation_amount": precipitation_amount,
            "weather_state": weather_state,
            "summary": summary
        }
        
        return result
    else:
        # Return a message if the forecast is not available for the target date
        return f"Weather forecast for {target_date.strftime('%Y-%m-%d')} is not available."

# Function to suggest clothing based on weather
def suggest_clothing(city_name: str, summary: str, precipitation_amount: float, temperature: float):
    """
    Suggests clothing recommendations based on weather conditions.

    Args:
        city_name (str): The name of the city.
        summary (str): The weather summary.
        precipitation_amount (float): The amount of precipitation in mm.
        temperature (float): The temperature in degrees Celsius.

    Returns:
        str: A string containing clothing suggestions.
    """
    if precipitation_amount > 0:
        # Suggest waterproof clothing and umbrella if it will rain
        return f"🌧️ The forecast shows {precipitation_amount:.1f} mm of rain in {city_name}. 🌂 Wear waterproof shoes and take an umbrella! ☔"
    elif temperature < 10:
        # Suggest warm clothing if the temperature is below 10°C
        return f"❄️ The temperature in {city_name} is {temperature:.1f}°C. 🧥 It's cold, wear a jacket and warm clothes! 🧣"
    elif 10 <= temperature <= 20:
        # Suggest a light jacket if the temperature is between 10°C and 20°C
        return f"🌥️ The temperature in {city_name} is {temperature:.1f}°C. It might be chilly, so wear a light jacket. 🧢"
    else:
        # Suggest light clothing if the temperature is above 20°C
        return f"☀️ The temperature in {city_name} is {temperature:.1f}°C. The weather seems pleasant, so light clothing should be fine! 😎"

# Create the tools with corrected function definitions
weather_tool = FunctionTool.from_defaults(fn=get_weather_for_natural_date)
clothing_tool = FunctionTool.from_defaults(fn=suggest_clothing)

# Define the system prompt for the weather assistant
system_prompt = """
You are a helpful and friendly weather assistant. When users ask about the weather, you provide a complete and informative response including the weather summary and useful advice like what to pack or wear based on the weather conditions. Always make sure to give the weather forecast and suggest appropriate clothing. Always give the weather forecast in response along with any other additional things like what to wear. Use emojis in response.
"""

# Create the chat agent with the system prompt
chat_agent = ReActAgent.from_tools(
    tools=[weather_tool, clothing_tool],
    verbose=True,
    system_prompt=system_prompt
)
