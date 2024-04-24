const query = require("db/query");
const producer = require("messaging/producer");
const extensions = require('extensions/extensions');
const daoApi = require("db/dao");

let dao = daoApi.create({
	table: "PI_USERS",
	properties: [
		{
			name: "Id",
			column: "USERS_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "FName",
			column: "USERS_FNAME",
			type: "VARCHAR",
			required: true
		},
 {
			name: "LName",
			column: "USERS_LNAME",
			type: "VARCHAR",
			required: true
		},
 {
			name: "Email",
			column: "USERS_EMAIL",
			type: "VARCHAR",
			required: true
		},
 {
			name: "Password",
			column: "USERS_PASSWORD",
			type: "VARCHAR",
			required: true
		},
 {
			name: "Phone",
			column: "USERS_PHONE",
			type: "VARCHAR",
			required: true
		},
 {
			name: "Country",
			column: "USERS_COUNTRY",
			type: "INTEGER",
		},
 {
			name: "Username",
			column: "USERS_USERNAME",
			type: "VARCHAR",
			required: true
		}
]
});

exports.list = function(settings) {
	return dao.list(settings);
};

exports.get = function(id) {
	return dao.find(id);
};

exports.create = function(entity) {
	let id = dao.insert(entity);
	triggerEvent({
		operation: "create",
		table: "PI_USERS",
		entity: entity,
		key: {
			name: "Id",
			column: "USERS_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent({
		operation: "update",
		table: "PI_USERS",
		entity: entity,
		key: {
			name: "Id",
			column: "USERS_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	let entity = dao.find(id);
	dao.remove(id);
	triggerEvent({
		operation: "delete",
		table: "PI_USERS",
		entity: entity,
		key: {
			name: "Id",
			column: "USERS_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "PIUSERS"');
	if (resultSet !== null && resultSet[0] !== null) {
		if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
			return resultSet[0].COUNT;
		} else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
			return resultSet[0].count;
		}
	}
	return 0;
};

function triggerEvent(data) {
	let triggerExtensions = extensions.getExtensions("dirigible-bank-server/users/Users");
	try {
		for (let i=0; i < triggerExtensions.length; i++) {
			let module = triggerExtensions[i];
			let triggerExtension = require(module);
			try {
				triggerExtension.trigger(data);
			} catch (error) {
				console.error(error);
			}			
		}
	} catch (error) {
		console.error(error);
	}
	producer.queue("dirigible-bank-server/users/Users").send(JSON.stringify(data));
}