const postGameHandler = async (req, res, { Game }) => {
    if (!getAuthUser(req))  {
        res.status(401).send('Not authorized');
        return;
    }
    const creator = JSON.parse(getAuthUser(req));

    const {name, genre, publisher, developer, year, photoURL} = req.body;
    const createdAt = new Date();
    const game = {
        name,
        genre,
        publisher,
        developer,
        year,
        photoURL,
        createdAt,
        creator
    };
    const query = new Game(game);
    query.save((err, newGame) => {
        if (err) {
            res.status(500).send('unable to create');
            return;
        }
        res.setHeader('content-type', 'application/json');
        res.status(201).json(newGame);
    })
};

const getGameHandler = async (req, res, { Game }) => {
	try {
        const games = await Game.find({});
        res.setHeader('content-type', 'application/json');
		res.status(200).json(games);
	} catch (e) {
        res.status(500).send("There was an issue getting games");
        return;
	}
};

const getSpecificGameHandler = async (req, res, { Game }) => {
	try {
        const gameId = req.params.gameid;
		let game = await Game.findById(gameId);
        // EXTRA CREDIT: Fetch channels that start with a certain value in their name
        res.setHeader('content-type', 'application/json');
		res.status(200).json(game);
	} catch (e) {
        res.status(500).send("There was an issue getting game");
        return;
	}
};

const postReviewHandler = async (req, res, { Review }) => {
    if (!getAuthUser(req))  {
        res.status(401).send('Not authorized');
        return;
    }
    const creator = JSON.parse(getAuthUser(req));

    const {gameID, rating, platform, body} = req.body;
    const createdAt = new Date();
    const review = {
        gameID,
        rating,
        platform,
        body,
        createdAt,
        creator
    };
    const query = new Review(review);
    query.save((err, newReview) => {
        if (err) {
            res.status(500).send('unable to create');
            return;
        }
        res.setHeader('content-type', 'application/json');
        res.status(201).json(newReview);
    })
};

const getReviewByGameHandler = async (req, res, { Review }) => {
	try {
        const id = req.params.gameid;
        const reviews = await Review.find({gameID: id});
        res.setHeader('content-type', 'application/json');
		res.status(200).json(reviews);
	} catch (e) {
        res.status(500).send("There was an issue getting games");
        return;
	}
};

function getAuthUser(request) {
    return request.get('X-User');
}

module.exports = {postGameHandler, getGameHandler, getSpecificGameHandler, postReviewHandler, getReviewByGameHandler}