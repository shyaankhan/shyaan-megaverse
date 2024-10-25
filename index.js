const candidateId = "79fed4c0-443b-4236-9e7e-0f73428888d3"

/* -------------------------------------------------------------------------------
CHALLENGE 1
Assumptions:
- Map always contain the same number of rows & columns
- Map's rows and columns are always 7 or greater (since there are 7 rows/cols of
polyanets in the challenge)
------------------------------------------------------------------------------- */
async function challenge1(clear = 0) {
  const map = await getMap()
  const method = clear ? "DELETE" : "POST" // Made it easy to clear the map if I pass "1" as an argument
  const midPoint = Math.floor(map.length / 2)
  for (var diff = 0; diff < 4; diff++) {
    const indices = [
      [midPoint - diff, midPoint + diff],
      [midPoint - diff, midPoint - diff],
      [midPoint + diff, midPoint - diff],
      [midPoint + diff, midPoint + diff]
    ]

    for (var i = 0; i < indices.length; i++) {
      await updateMap({ row: indices[i][0], column: indices[i][1], method })
    }
  }
}

/* -------------------------------------------------------------------------------
CHALLENGE 2
Assumptions: 
- Map is valid
------------------------------------------------------------------------------- */
async function challenge2(clear = 0) {
  const map = await getMap()
  const method = clear ? "DELETE" : "POST" // Made it easy to clear the map if I pass "1" as an argument
  for (var row = 0; row < map.length; row++) {
    for (var column = 0; column < map[row].length; column++) {
      var currentMapObject = map[row][column]
      if (currentMapObject.includes("POLYANET")) {
        await updateMap({ row, column, method })
      }
      if (currentMapObject.includes("COMETH")) {
        var direction = currentMapObject.split("_")[0].toLowerCase() // Split astral object to get the description of the object, make lowercase for the API
        await updateMap({ row, column, method, direction })
      }
      if (currentMapObject.includes("SOLOON")) {
        var color = currentMapObject.split("_")[0].toLowerCase() // Split astral object to get the description of the object, make lowercase for the API
        await updateMap({ row, column, method, color })
      }
    }
  }
}

/* -------------------------------------------------------------------------------
Helper function get the current map. Any errors in retrieval will be handled
------------------------------------------------------------------------------- */
async function getMap() {
  try {
    const response = await fetch(`https://challenge.crossmint.io/api/map/${candidateId}/goal`)
    const responseJSON = await response.json()
    return responseJSON.goal
  } catch (error){
    return "Failed to retrieve map"
  }
}

/* -------------------------------------------------------------------------------
Helper function to call the API. Will take an object containing row, column,
method, color or direction.
------------------------------------------------------------------------------- */
async function updateMap(updateObj) {
  try {
    const ROUTE = "https://challenge.crossmint.io/api/"
    var endpoint = updateObj.color ? "soloons" : updateObj.direction ? "comeths" : "polyanets"    // If color is present, it's meant to be a Soloon, if direction present, then cometh, otherwise polyanet
    const response = await fetch(ROUTE + endpoint, {
      method: updateObj.method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ row: updateObj.row, column: updateObj.column, candidateId, color: updateObj.color, direction: updateObj.direction }) // Empty parameters are ignored by API
    })
    if (await response.status == 200) {
      console.log(`${updateObj.method} ${endpoint} on [${updateObj.row}, ${updateObj.column}].`)
      return response
    } else {
      console.log("Retrying")
      await new Promise(resolve => setTimeout(resolve, 1500))
      await updateMap(updateObj) // Recursive retry logic to keep trying
      return response
    }
  } catch (error) {
    console.log({ error })
    return error
  }
}

// challenge1()
// challenge2()
