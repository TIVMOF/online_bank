const query = require("db/query");
const producer = require("messaging/producer");
const extensions = require('extensions/extensions');
const daoApi = require("db/dao");
const EntityUtils = require("dirigible-bank-server/gen/dao/utils/EntityUtils");

let dao = daoApi.create({
	table: "PI_CURRENCY",
	properties: [
		{
			name: "Id",
			column: "CURRENCY_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Code",
			column: "CURRENCY_CODE",
			type: "VARCHAR",
		},
 {
			name: "Name",
			column: "CURRENCY_NAME",
			type: "VARCHAR",
		},
 {
			name: "Numeric",
			column: "CURRENCY_NUMERIC",
			type: "VARCHAR",
		},
 {
			name: "Rounding",
			column: "CURRENCY_ROUNDING",
			type: "INTEGER",
		},
 {
			name: "Base",
			column: "CURRENCY_BASE",
			type: "BOOLEAN",
		},
 {
			name: "Rate",
			column: "CURRENCY_RATE",
			type: "DOUBLE",
		}
]
});

exports.list = function(settings) {
	return dao.list(settings).map(function(e) {
		EntityUtils.setBoolean(e, "Base");
		return e;
	});
};

exports.get = function(id) {
	let entity = dao.find(id);
	EntityUtils.setBoolean(entity, "Base");
	return entity;
};

exports.create = function(entity) {
	EntityUtils.setBoolean(entity, "Base");
	let id = dao.insert(entity);
	triggerEvent({
		operation: "create",
		table: "PI_CURRENCY",
		entity: entity,
		key: {
			name: "Id",
			column: "CURRENCY_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	EntityUtils.setBoolean(entity, "Base");
	dao.update(entity);
	triggerEvent({
		operation: "update",
		table: "PI_CURRENCY",
		entity: entity,
		key: {
			name: "Id",
			column: "CURRENCY_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	let entity = dao.find(id);
	dao.remove(id);
	triggerEvent({
		operation: "delete",
		table: "PI_CURRENCY",
		entity: entity,
		key: {
			name: "Id",
			column: "CURRENCY_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "PICURRENCY"');
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
	let triggerExtensions = extensions.getExtensions("dirigible-bank-server/Currencies/Currency");
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
	producer.queue("dirigible-bank-server/Currencies/Currency").send(JSON.stringify(data));
}