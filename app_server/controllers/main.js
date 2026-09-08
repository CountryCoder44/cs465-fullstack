/* GET home page. */
const index = (req, res) => {
    res.render('index', {
        title: 'Travlr Getaways',
        homeSelected: true
    });
};

module.exports = {
    index
};
