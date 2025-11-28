'use strict'

class AccessController {
    signup = async (req, res, next) => {
        try {
            console.log("[P]::signUp::", req.body);
            return res.status(200).json(
                {
                    code: '200XX',
                    metadata: {userId: 1},
                    desc: 'Request successful',
                    message: `Day la thong tin ma ban request ${JSON.stringify(req.body)}`
                }
            );
        } catch (error) {
            console.log("An error occured",error)
        }
    }
}

module.exports = new AccessController()