module.exports = {
    
    onFailure : function (req, res) {
        res.json({auth : false, error : "Not Logged In"});
    },

    authenticated : function (req, res, accept, reject) {
        if (req.session) {
            if (req.session.loggedin) {
                accept();
            } else {
                reject();
            }
        } else {
            reject();
        }
    }
};