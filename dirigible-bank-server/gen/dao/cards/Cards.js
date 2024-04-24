const query = require("db/query");
const producer = require("messaging/producer");
const extensions = require('extensions/extensions');
const daoApi = require("db/dao");
const EntityUtils = require("dirigible-bank-server/gen/dao/utils/EntityUtils");

let dao = daoApi.create({
	table: "PI_CARDS",
	properties: [
		{
			name: "Id",
			column: "CARDS_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Users",
			column: "CARDS_USERS",
			type: "INTEGER",
		},
 {
			name: "CardNumber",
			column: "CARDS_CARDNUMBER",
			type: "VARCHAR",
			required: true
		},
 {
			name: "ExpirationDate",
			column: "CARDS_EXPIRATIONDATE",
			type: "DATE",
		},
 {
			name: "CardType",
			column: "CARDS_CARDTYPE",
			type: "INTEGER",
			required: true
		}
]
});

exports.list = function(settings) {
	return dao.list(settings).map(function(e) {
		EntityUtils.setDate(e, "ExpirationDate");
		return e;
	});
};

exports.get = function(id) {
	let entity = dao.find(id);
	EntityUtils.setDate(entity, "ExpirationDate");
	return entity;
};

exports.create = function(entity) {
	EntityUtils.setLocalDate(entity, "ExpirationDate");
	let id = dao.insert(entity);
	triggerEvent({
		operation: "create",
		table: "PI_CARDS",
		entity: entity,
		key: {
			name: "Id",
			column: "CARDS_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	// EntityUtils.setLocalDate(entity, "ExpirationDate");
	dao.update(entity);
	triggerEvent({
		operation: "update",
		table: "PI_CARDS",
		entity: entity,
		key: {
			name: "Id",
			column: "CARDS_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	let entity = dao.find(id);
	dao.remove(id);
	triggerEvent({
		operation: "delete",
		table: "PI_CARDS",
		entity: entity,
		key: {
			name: "Id",
			column: "CARDS_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "PICARDS"');
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
	let triggerExtensions = extensions.getExtensions("dirigible-bank-server/cards/Cards");
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
	producer.queue("dirigible-bank-server/cards/Cards").send(JSON.stringify(data));
}