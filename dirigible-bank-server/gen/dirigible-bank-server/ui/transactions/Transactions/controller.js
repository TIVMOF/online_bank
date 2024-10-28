angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'dirigible-bank-server.transactions.Transactions';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/dirigible-bank-server/gen/dirigible-bank-server/api/transactions/TransactionsService.ts";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', 'Extensions', function ($scope, $http, messageHub, entityApi, Extensions) {

		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataOffset = 0;
		$scope.dataLimit = 10;
		$scope.action = "select";

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'dirigible-bank-server-custom-action').then(function (response) {
			$scope.pageActions = response.filter(e => e.perspective === "transactions" && e.view === "Transactions" && (e.type === "page" || e.type === undefined));
		});

		$scope.triggerPageAction = function (action) {
			messageHub.showDialogWindow(
				action.id,
				{},
				null,
				true,
				action
			);
		};
		//-----------------Custom Actions-------------------//

		function refreshData() {
			$scope.dataReset = true;
			$scope.dataPage--;
		}

		function resetPagination() {
			$scope.dataReset = true;
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.selectedEntity = null;
				$scope.action = "select";
			});
		});

		messageHub.onDidReceiveMessage("entityCreated", function (msg) {
			refreshData();
			$scope.loadPage($scope.dataPage, $scope.filter);
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			refreshData();
			$scope.loadPage($scope.dataPage, $scope.filter);
		});

		messageHub.onDidReceiveMessage("entitySearch", function (msg) {
			resetPagination();
			$scope.filter = msg.data.filter;
			$scope.filterEntity = msg.data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		});
		//-----------------Events-------------------//

		$scope.loadPage = function (pageNumber, filter) {
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			if (!filter) {
				filter = {};
			}
			$scope.selectedEntity = null;
			entityApi.count(filter).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Transactions", `Unable to count Transactions: '${response.message}'`);
					return;
				}
				if (response.data) {
					$scope.dataCount = response.data;
				}
				$scope.dataPages = Math.ceil($scope.dataCount / $scope.dataLimit);
				filter.$offset = ($scope.dataPage - 1) * $scope.dataLimit;
				filter.$limit = $scope.dataLimit;
				if ($scope.dataReset) {
					filter.$offset = 0;
					filter.$limit = $scope.dataPage * $scope.dataLimit;
				}

				entityApi.search(filter).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("Transactions", `Unable to list/filter Transactions: '${response.message}'`);
						return;
					}
					if ($scope.data == null || $scope.dataReset) {
						$scope.data = [];
						$scope.dataReset = false;
					}

					response.data.forEach(e => {
						if (e.Date) {
							e.Date = new Date(e.Date);
						}
					});

					$scope.data = $scope.data.concat(response.data);
					$scope.dataPage++;
				});
			});
		};
		$scope.loadPage($scope.dataPage, $scope.filter);

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.postMessage("entitySelected", {
				entity: entity,
				selectedMainEntityId: entity.Id,
				optionsReciever: $scope.optionsReciever,
				optionsSender: $scope.optionsSender,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			$scope.action = "create";

			messageHub.postMessage("createEntity", {
				entity: {},
				optionsReciever: $scope.optionsReciever,
				optionsSender: $scope.optionsSender,
			});
		};

		$scope.updateEntity = function () {
			$scope.action = "update";
			messageHub.postMessage("updateEntity", {
				entity: $scope.selectedEntity,
				optionsReciever: $scope.optionsReciever,
				optionsSender: $scope.optionsSender,
			});
		};

		$scope.deleteEntity = function () {
			let id = $scope.selectedEntity.Id;
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
						refreshData();
						$scope.loadPage($scope.dataPage, $scope.filter);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		$scope.openFilter = function (entity) {
			messageHub.showDialogWindow("Transactions-filter", {
				entity: $scope.filterEntity,
				optionsReciever: $scope.optionsReciever,
				optionsSender: $scope.optionsSender,
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsReciever = [];
		$scope.optionsSender = [];


		$http.get("/services/ts/dirigible-bank-server/gen/dirigible-bank-server/api/bankAccount/BankAccountsService.ts").then(function (response) {
			$scope.optionsReciever = response.data.map(e => {
				return {
					value: e.Id,
					text: e.IBAN
				}
			});
		});

		$http.get("/services/ts/dirigible-bank-server/gen/dirigible-bank-server/api/bankAccount/BankAccountsService.ts").then(function (response) {
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
