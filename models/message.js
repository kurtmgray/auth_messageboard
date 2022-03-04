const mongoose = require('mongoose')

const Schema = mongoose.Schema

const MessageSchema = new Schema(
    {
        title: {type: String, required: true},
        text: {type: String, required: true},
        timestamp: {type: Date},
        author: {type: Schema.Types.ObjectId, ref: 'user'}
    }
)

MessageSchema
.virtual('url')
.get(() => {
    return '/board/message/' + this._id 
})

module.exports = mongoose.model('Message', MessageSchema)