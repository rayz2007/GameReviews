const postGameHandler = async (req, res, { Game }) => {
    if (!getAuthUser(req))  {
        res.status(401).send('Not authorized');
        return;
    }
    const creator = JSON.parse(getAuthUser(req));

    const {name, genre, publisher, developer, year} = req.body;
    const createdAt = new Date();
    const game = {
        name,
        publisher,
        developer,
        year,
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

const getGamesHandler = async (req, res, { Game }) => {
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
        const gameId = req.query.id;
		let game = await Game.findById(gameId);
        // EXTRA CREDIT: Fetch channels that start with a certain value in their name
        res.setHeader('content-type', 'application/json');
		res.status(200).json(game);
	} catch (e) {
        res.status(500).send("There was an issue getting game");
        return;
	}
};

function getAuthUser(request) {
    return request.get('X-User');
}

