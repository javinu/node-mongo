var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    description: { type: String, required: true, unique: true },
    price: { type: Number},
    currency: { type: String}, 
});

var shopSchema = new Schema({
	name: { type: String, required: true, unique: true },
    location: String,
    products: [productSchema], 
	created_at: Date,
	updated_at: Date
});

shopSchema.pre('save', function (next) {
	var currentDate = new Date();
	this.updated_at = currentDate;

	if (!this.created_at)
		this.created_at = currentDate;

	next();
});

var Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
