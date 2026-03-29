---
name: node-api-backend
description: Builds the Express.js server, handles MongoDB connections, and manages external travel API aggregation.
---

## Objective
Build a Node.js and Express.js backend that acts as the central traffic controller for the application.

## Workflow
1. Setup an Express application and establish a connection to MongoDB Atlas using Mongoose.
2. Define Mongoose schemas for Route, PriceSnapshot, and Prediction.
3. Construct API endpoints to process search queries from the React frontend.
4. Integrate with external travel aggregator APIs to retrieve live transport data.
5. Parse the external API response, sort the results by price in ascending order, and isolate the top 5 cheapest options.
6. Transmit the top 5 options via HTTP POST request to the internal Python FastAPI microservice.
7. Await the AI predictions, merge them with the top 5 results, append the unanalyzed remaining results, and return the complete payload to the frontend.