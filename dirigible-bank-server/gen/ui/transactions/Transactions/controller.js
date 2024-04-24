angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'dirigible-bank-server.transactions.Transactions';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/dirigible-bank-server/gen/api/transactions/Transactions.js";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', function ($scope, $http, messageHub, entityApi) {

		//-----------------Custom Actions-------------------//
		$http.get("/services/js/resources-core/services/custom-actions.js?extensionPoint=dirigible-bank-server-custom-action").then(function (response) {
			$scope.pageActions = response.data.filter(e => e.perspective === "transactions" && e.view === "Transactions" && (e.type === "page" || e.type === undefined));
			$scope.entityActions = response.data.filter(e => e.perspective === "transactions" && e.view === "Transactions" && e.type === "entity");
		});

		$scope.triggerPageAction = function (actionId) {
			for (const next of $scope.pageActions) {
				if (next.id === actionId) {
					messageHub.showDialogWindow("dirigible-bank-server-custom-action", {
						src: next.link,
					});
					break;
				}
			}
		};

		$scope.triggerEntityAction = function (actionId, selectedEntity) {
			for (const next of $scope.entityActions) {
				if (next.id === actionId) {
					messageHub.showDialogWindow("dirigible-bank-server-custom-action", {
						src: `${next.link}?id=${selectedEntity.Id}`,
					});
					break;
				}
			}
		};
		//-----------------Custom Actions-------------------//

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 20;
		}
		resetPagination();

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("entityCreated", function (msg) {
			$scope.loadPage($scope.dataPage);
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			$scope.loadPage($scope.dataPage);
		});
		//-----------------Events-------------------//

		$scope.loadPage = function (pageNumber) {
			$scope.dataPage = pageNumber;
			entityApi.count().then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Transactions", `Unable to count Transactions: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				entityApi.list(offset, limit).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("Transactions", `Unable to list Transactions: '${response.message}'`);
						return;
					}

					response.data.forEach(e => {
						if (e.Date) {
							e.Date = new Date(e.Date);
						}
					});

					$scope.data = response.data;
				});
			});
		};
		$scope.loadPage($scope.dataPage);

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.showDialogWindow("Transactions-details", {
				action: "select",
				entity: entity,
				optionsReciever: $scope.optionsReciever,
				optionsSender: $scope.optionsSender,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("Transactions-details", {
				action: "create",
				entity: {},
				optionsReciever: $scope.optionsReciever,
				optionsSender: $scope.optionsSender,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("Transactions-details", {
				action: "update",
				entity: entity,
				optionsReciever: $scope.optionsReciever,
				optionsSender: $scope.optionsSender,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete Transactions?',
				`Are you sure you want to delete Transactions? This action cannot be undone.`,
				[{
					id: "delete-btn-yes",
					type: "emphasized",
					label: "Yes",
				},
				{
					id: "delete-btn-no",
					type: "normal",
					label: "No",
				}],
			).then(function (msg) {
				if (msg.data === "delete-btn-yes") {
					entityApi.delete(id).then(function (response) {
						if (response.status != 204) {
							messageHub.showAlertError("Transactions", `Unable to delete Transactions: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsReciever = [];
		$scope.optionsSender = [];

		$http.get("/services/js/dirigible-bank-server/gen/api/bankAccount/BankAccounts.js").then(function (response) {
			$scope.optionsReciever = response.data.map(e => {
				return {
					value: e.Id,
					text: e.IBAN
				}
			});
		});

		$http.get("/services/js/dirigible-bank-server/gen/api/bankAccount/BankAccounts.js").then(function (response) {
			$scope.optionsSender = response.data.map(e => {
				return {
					value: e.Id,
					text: e.IBAN
				}
			});
		});
		$scope.optionsRecieverValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsReciever.length; i++) {
				if ($scope.optionsReciever[i].value === optionKey) {
					return $scope.optionsReciever[i].text;
				}
			}
			return null;
		};
		$scope.optionsSenderValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsSender.length; i++) {
				if ($scope.optionsSender[i].value === optionKey) {
					return $scope.optionsSender[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
