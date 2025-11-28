const {model, Schema} = require('mongoose'); // Erase if already required
const COLLECTION_NAME = 'Keys'
const DOCUMENT_NAME = 'Key'
// Declare the Schema of the Mongo model
var keySchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        require: true,
    },
    privateKey:{
        type: String,
        require: true,
    },
    refreshToken: {
        type: String,
        default: ""
    }
},
    {
        collection: COLLECTION_NAME,
        timestamps: true
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, keySchema);