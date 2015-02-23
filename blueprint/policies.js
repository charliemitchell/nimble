module.exports = {
    
    onFailure : function (req, res) {
        res.json({auth : false, error : "Not Logged In"});
    },

    authenticated : function (req, res) {
        if (req.session) {
            if (req.session.loggedin) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
};