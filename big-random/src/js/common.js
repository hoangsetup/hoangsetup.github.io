/**
 * Created by hoangdv on 1/6/2017.
 */
module.exports = {
	getRandomItem: function(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	},
	getRandomSingleNumber: function(max) {
		return Math.floor(Math.random() * (max + 1));
	}
};