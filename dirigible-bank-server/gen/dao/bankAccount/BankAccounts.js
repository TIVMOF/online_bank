const query = require("db/query");
const producer = require("messaging/producer");
const extensions = require('extensions/extensions');
const daoApi = require("db/dao");
const EntityUtils = require("dirigible-bank-server/gen/dao/utils/EntityUtils");

let dao = daoApi.create({
	table: "PI_BANKACCOUNTS",
	properties: [
		{
			name: "Id",
			column: "BANKACCOUNTS_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Amount",
			column: "BANKACCOUNTS_AMOUNT",
			type: "DOUBLE",
			required: true
		},
 {
			name: "IBAN",
			column: "BANKACCOUNTS_PROPERTY3",
			type: "VARCHAR",
			required: true
		},
 {
			name: "Users",
			column: "BANKACCOUNTS_USERS",
			type: "INTEGER",
		},
 {
			name: "BankAccountType",
			column: "BANKACCOUNTS_BANKACCOUNTTYPE",
			type: "INTEGER",
		},
 {
			name: "BankAccountStatus",
			column: "BANKACCOUNTS_BANKACCOUNTSTATUS",
			type: "INTEGER",
		},
 {
			name: "CreationDate",
			column: "BANKACCOUNTS_CREATIONDATE",
			type: "DATE",
			required: true
		},
 {
			name: "Currency",
			column: "BANKACCOUNTS_CURRENCY",
			type: "INTEGER",
		}
]
});

exports.list = function(settings) {
	return dao.list(settings).map(function(e) {
		EntityUtils.setDate(e, "CreationDate");
		return e;
	});
};

exports.get = function(id) {
	let entity = dao.find(id);
	EntityUtils.setDate(entity, "CreationDate");
	return entity;
};

exports.create = function(entity) {
	EntityUtils.setLocalDate(entity, "CreationDate");
	let id = dao.insert(entity);
	triggerEvent({
		operation: "create",
		table: "PI_BANKACCOUNTS",
		entity: entity,
		key: {
			name: "Id",
			column: "BANKACCOUNTS_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	// EntityUtils.setLocalDate(entity, "CreationDate");
	dao.update(entity);
	triggerEvent({
		operation: "update",
		table: "PI_BANKACCOUNTS",
		entity: entity,
		key: {
			name: "Id",
			column: "BANKACCOUNTS_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	let entity = dao.find(id);
	dao.remove(id);
	triggerEvent({
		operation: "delete",
		table: "PI_BANKACCOUNTS",
		entity: entity,
		key: {
			name: "Id",
			column: "BANKACCOUNTS_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "PIBANKACCOUNTS"');
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
	let triggerExtensions = extensions.getExtensions("dirigible-bank-server/bankAccount/BankAccounts");
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
	producer.queue("dirigible-bank-server/bankAccount/BankAccounts").send(JSON.stringify(data));
}