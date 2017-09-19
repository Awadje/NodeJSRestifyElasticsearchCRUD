module.exports = (server, errors, esClient) => {
    /**
     * @param {string} name - the username we want to search on
     * @returns {array} array with the results
     */
    server.get('/hello/:name', (req, res, next) => {
        esClient.search({
                index: 'taart',
                body: {
                    query: {
                        match: {
                            username: req.params.name
                        }
                    }
                }
            })
            .then(results => {
                if (!results.hits || !results.hits.hits || results.hits.hits.length < 1) {
                    return next(new errors.NotFoundError(`Documents with the user: ${req.params.name} cannot be found!`))
                }

                res.send(results.hits.hits)
                return next()
            })
    })

    /**
     * the username we want to save
     * 
     * @param {string} name - the username we want to store
     * @returns {string} a string with the username
     */
    server.post('/hello/:name', (req, res, next) => {
        // create the document in elasticsearch
        esClient.index({
            index: 'taart',
            type: 'user',
            body: {
                username: req.params.name
            }
        })
        res.send(`hello ${req.params.name}`)
    })

    /**
     * Update a document by id
     * @param {string} id - the id of the document to update
     * @returns {object} the patched resource
     */
    server.patch('/hello/:id', (req, res, next) => {
        esClient.update({
                index: 'taart',
                type: 'user',
                id: req.params.id,
                body: { doc: req.body }
            })
            .then(result => res.send(result))
            .then(next())
    })

    /**
     * Delete a document by id
     * @param {string} id - the id of the document to update
     * @returns {object} the deleted resource
     */
    server.del('/hello/:id', (req, res, next) => {
        esClient.delete({
                index: 'taart',
                type: 'user',
                id: req.params.id,
                body: { doc: req.body }
            })
            .then(result => res.send(result))
            .then(next())
    })
}