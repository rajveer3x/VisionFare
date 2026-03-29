---
name: fastapi-ai-service
description: Builds the Python FastAPI microservice that executes the machine learning model for price predictions.
---

## Objective
Create a high-performance Python web service using FastAPI to serve Scikit-Learn machine learning predictions to the main backend.

## Workflow
1. Initialize a FastAPI application environment.
2. Define a POST endpoint designed to receive travel route data and current pricing arrays.
3. Load the pre-trained Scikit-Learn model `.pkl` file into memory upon server startup.
4. Transform the incoming JSON payload into a Pandas DataFrame or NumPy array format compatible with the loaded model.
5. Execute model inference to calculate the expected price trend and confidence score for each provided route.
6. Format the output into a JSON response containing a distinct BUY NOW or WAIT recommendation for each item and return it to the requesting server.