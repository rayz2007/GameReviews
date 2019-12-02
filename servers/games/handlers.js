const postGameHandler = async (req, res, {Game}) => {
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

function getAuthUser(request) {
    return request.get('X-User');
}

