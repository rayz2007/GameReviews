# GameReviews

## Problem 
When looking for video games to play, one usually has to know what they are looking for, or browse on game store pages such as the Steam store. After knowing what kind of game they are looking for, one may go to a review site to get a sense of how well the game has been received by others. However, there is no real site or app for browsing games and checking out reviews simply with no other noise. Review sites like IGN simply have review articles for new games and no clear way to navigate between genres or consoles. 

In short, the problem we are aiming to solve is the lack of a simple, focused platform for game reviews that gamers on any console can visit for browsing games and providing reviews. 

## Solution
As gamers ourselves, we would love to be able to have and use a service that allows us to browse games across any console when we want to simply do some game “window-shopping” or check how well a game that we are particularly interested in is doing. A simple interface that just shows games, with their reviews and some info about their reviews would be all we need. We would also love to provide and contribute to these reviews. 

## Architecture
![architecture](Messages Image(3400125444).jpeg)


## User Stories
Priority | User | Description | Implementation
--- | --- | --- | ---
P0 | User | I want to find games that are available on each of the consoles I own. | After a **HTTP GET** request by the client, the games service will display available games. These will be retrieved by console by default.
P1 | User | I want to quickly filter games that are under a certain approval rating. | Create an affordance for **GET** requests that contain a query string parameter for the approval threshold, and display the response.
P2 | User | I want to upload my own review to contribute to overall rating of a game | Send an **HTTP POST** request that contains data about who the reviewer is and the contents of the review.

## Client Description
A web application with an interface that shows games per console, and rating scores alongside each game. Scores will be based on averages from user reviews made by those with an account. Games can be filtered by score as well. Users will also be able to leave a quick score of a game on this interface

## API Endpoints

### GET /v1/games
Get all game titles and information
* 200: `application/json` successfully retrieved all games. Body contains encoded game information.
* 500: Internal server error.

### GET /v1/games/{gameid}
Get game title corresponding to ID.
* 200: `application/json` successfully retrieved game. Body contains encoded game information.
* 400: Bad Request. ID not provided or invalid.
* 500: Internal server error.


### POST /v1/games
Post new game title.
* 200: `application/json` successfully updated table with new game information. Body contains encoded game information.
* 401: Unauthorized user
* 415: Could not decode body or body is of unsupported type.
* 500: Internal server error.


### GET /v1/games/reviews/{gameid}
Get reviews for game title corresponding to provided ID.
* 200: `application/json` successfully retrieved reviews for given game. Body contains encoded review information.
* 400: Bad Request. ID not provided or invalid.
* 500: Internal server 


### POST /v1/games/reviews
Post new game review.
* 200: `application/json` successfully added new review. Body contains encoded review information.
* 415: Could not decode body or body is of unsupported type.
* 500: Internal server error


### GET /v1/users/{userid}
Get user corresponding to provided ID.
* 200: `application/json` successfully retrieved user. Body contains encoded user information.
* 400: Bad Request. ID not provided or invalid.
* 500: Internal server error


### POST /v1/users
Post new user credentials.
* 200: `application/json` successfully added new user. Body contains encoded user information.
* 415: Could not decode body or body is of unsupported type.
* 500: Internal server error

### POST /v1/sessions
Post a new session based on user credentials.
* 201: `application/json` successfully authenticated/retrieved user and started session
* 401: Unauthorized, wrong credentials
* 415: Could not decode body or body is of unsupported type.
* 500: Internal server error

### DELETE /v1/sessions/{sessid}
Delete a session (must be your own “mine).
* 200: Successfully ended session.
* 403: The user is attempting to end another user's session.
* 500: Internal server error.


## MongoDB Document Models
Users

* “id”: number,
* “email”: string
* “user_name”: string,
* “passHash”: binary,
* “first_name”: string,
* “last_name”: string,
* “photoURL”: string

Games
	
* “id”: string,
* “title”: string,
* “publisher”: string,
* “year”: Date,
* “photoUrl”: string

Reviews

* “id”: string,
* “gameID”: string,
* “creator”: user,
* “createdAt”: Date,
* “score”: number,
* “body”: string




