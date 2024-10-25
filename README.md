# shyaan-megaverse
## Code Design
I split the logic into 2 primary functions:
1. To determine the position of the astral objects in the given challenge
2. Handle the API request (inlcuding rate limiting/retries, varying endpoints and body parameters)

The strategy to determine the positions of the objects are described below for each challenge. 

To interact with the API, I prioritized simplifying the code (by # of lines) as well as reducing repetitive functionality. This is why I didn't separate functions for managing the different types of astral objects. Instead, I was able to use one function, additional logic to dynamically craft the right API request. I feel like doing this didn't compromise on the function's readability, but rather made the overall code much simple. 

## Challenge 1
### Assumptions:
- Map always contain the same number of rows & columns
- Map's rows and columns are always 7 or greater (since there are 7 rows/cols of
polyanets in the challenge)

### Strategy:
The strategy I went for here was to split up the map into 4 quadrants, just like
a graph. After identifying a midpoint, each polyanet was the same distance away
from the midpoint in each quadrant, which meant I didn't need to parse through 
the entire map, making it pretty efficient.


## Challenge 2
### Assumptions:
- Map is valid

### Strategy:
I spent quite a bit of time racking my brain on how to do this in an optimized way by looking for patterns. I noticed the polyanets were always coupled, either 1 row/column apart from each other, and changed directions every 4 sets. However, I got stumped on finding any patterns for comeths/soloons. The only way I was able to complete this challenge was by brute force.

## How to Run
Clone this repo and run `node index.js`. Make sure you're using `v20.18.0`. Uncomment the function at the bottom of code to run it.

## Issues
### Node version
I ran into some hardware issue, as my laptop was running an older version of Node that caused the Content-Length header to not be generated correctly. All my API's were failing, but updating to the latest Node version was the simple fix.
### Rate limits
I spent a bit of time trying to optimize my code to run within the rate limits. I tried to time the miliseconds between requests to determine what the upper limits were, but I couldn't get a clear enough idea of the limits. Ultimately, I had to put arbitrary delays to slow the API requests down, along with some recursive retry logic to keep trying until the API call succeeds.
