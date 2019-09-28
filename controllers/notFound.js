module.exports = (req, res) => {
    const body = JSON.parse(req.buffer);

    res.writeHead(404);
    res.end(JSON.stringify(body));
};
