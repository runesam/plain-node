module.exports = (req, res) => {
    const body = JSON.parse(req.buffer);

    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify(body));
};
