const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const popSchema = new Schema({
    upc: {type:Number},
    name: String,
    refNum: Number,
    variant: String,
    image: String,
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User', required: true}
  }, {
    timestamps: true
  });
  

module.exports = mongoose.model('Pop', popSchema);
