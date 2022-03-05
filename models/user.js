const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema(
    {
        username: {type: String, required: true},
        password: {type: String, required: true},
        fname: {type: String, required: true},
        lname: {type: String, required: true},
        memberStatus: {type: Boolean, required: true}
    }
)

UserSchema
.virtual('name')
.get(function() {
    return this.fname + ' ' + this.lname
})

UserSchema
.virtual('url')
.get(function() {
    return '/users/' + this._id
})

module.exports = mongoose.model('User', UserSchema)