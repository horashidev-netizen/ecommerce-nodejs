const {model, Schema, Types} = require('mongoose'); // Erase if already required
const COLLECTION_NAME = 'Shops';
const DOCUMENT_NAME = 'Shop'
// Declare the Schema of the Mongo model
var shopSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    verify: {
        type: Schema.Types.Boolean,
        default: false
    }
},
{
    timestamps: true,
    collection: COLLECTION_NAME,
}
);

//Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);