const query = require("db/query");
const producer = require("messaging/producer");
const extensions = require('extensions/extensions');
const daoApi = require("db/dao");
const EntityUtils = require("dirigible-bank-server/gen/dao/utils/EntityUtils");

let dao = daoApi.create({
	table: "PI_TRANSACTIONS",
	properties: [
		{
			name: "Id",
			column: "TRANSACTIONS_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Reciever",
			column: "TRANSACTIONS_RECIEVER",
			type: "INTEGER",
		},
 {
			name: "Sender",
			column: "TRANSACTIONS_SENDER",
			type: "INTEGER",
		},
 {
			name: "Amount",
			column: "TRANSACTIONS_AMOUNT",
			type: "DOUBLE",
		},
 {
			name: "Date",
			column: "TRANSACTIONS_DATE",
			type: "DATE",
		}
]
});

exports.list = function(settings) {
	return dao.list(settings).map(function(e) {
		EntityUtils.setDate(e, "Date");
		return e;
	});
};

exports.get = function(id) {
	let entity = dao.find(id);
	EntityUtils.setDate(entity, "Date");
	return entity;
};

exports.create = function(entity) {
	EntityUtils.setLocalDate(entity, "Date");
	let id = dao.insert(entity);
	triggerEvent({
		operation: "create",
		table: "PI_TRANSACTIONS",
		entity: entity,
		key: {
			name: "Id",
			column: "TRANSACTIONS_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	// EntityUtils.setLocalDate(entity, "Date");
	dao.update(entity);
	triggerEvent({
		operation: "update",
		table: "PI_TRANSACTIONS",
		entity: entity,
		key: {
			name: "Id",
			column: "TRANSACTIONS_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	let entity = dao.find(id);
	dao.remove(id);
	triggerEvent({
		operation: "delete",
		table: "PI_TRANSACTIONS",
		entity: entity,
		key: {
			name: "Id",
			column: "TRANSACTIONS_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "PITRANSACTIONS"');
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
	let triggerExtensions = extensions.getExtensions("dirigible-bank-server/transactions/Transactions");
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
	producer.queue("dirigible-bank-server/transactions/Transactions").send(JSON.stringify(data));
}