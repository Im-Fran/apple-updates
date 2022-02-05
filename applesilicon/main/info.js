// Save update data for searching

const firebase = require("firebase-admin");

require('../error.js')();

let db = firebase.firestore();

const database = db.collection('other').doc('information');

module.exports = function() {
	this.save_update = async function(cname, version, size, build, updateid, changelog) {
		let information = database.collection(cname.toLowerCase());

		if (!build) return;

		let cache = await information.doc(build).get();
		let cache_data = cache.data();

		let data = {
			"version": version,
			"size": size,
			"build": build,
			"updateid": updateid,
			"changelog": changelog
		};

		try {
			if (cache_data == undefined) await information.doc(build).set(data);
			else await information.doc(build).update(data);
		} catch(error) {
			return send_error(`Cannot update information`, "info.js", `save_update`, `uploading for ${cname}.`);
		}
	}

	this.save_package = async function(cname, build, version, size, package) {
		let information = database.collection(cname.toLowerCase());

		if (!build) return;

		let cache = await information.doc(build).get();
		let cache_data = cache.data();

		let data = {
			"version": version,
			"build": build,
			"package": package,
			"packagesize": size
		};

		try {
			if (cache_data == undefined) await information.doc(build).set(data);
			else await information.doc(build).update(data);
		} catch(error) {
			return send_error(`Cannot update information`, "info.js", `save_package`, `uploading for ${cname}.`);
		}
	}
}