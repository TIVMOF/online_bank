angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'dirigible-bank-server.bankAccount.BankAccounts';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/dirigible-bank-server/gen/api/bankAccount/BankAccounts.js";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', function ($scope, $http, messageHub, entityApi) {

		//-----------------Custom Actions-------------------//
		$http.get("/services/js/resources-core/services/custom-actions.js?extensionPoint=dirigible-bank-server-custom-action").then(function (response) {
			$scope.pageActions = response.data.filter(e => e.perspective === "bankAccount" && e.view === "BankAccounts" && (e.type === "page" || e.type === undefined));
			$scope.entityActions = response.data.filter(e => e.perspective === "bankAccount" && e.view === "BankAccounts" && e.type === "entity");
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
					messageHub.showAlertError("BankAccounts", `Unable to count BankAccounts: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				entityApi.list(offset, limit).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("BankAccounts", `Unable to list BankAccounts: '${response.message}'`);
						return;
					}

					response.data.forEach(e => {
						if (e.CreationDate) {
							e.CreationDate = new Date(e.CreationDate);
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
			messageHub.showDialogWindow("BankAccounts-details", {
				action: "select",
				entity: entity,
				optionsUsers: $scope.optionsUsers,
				optionsBankAccountType: $scope.optionsBankAccountType,
				optionsBankAccountStatus: $scope.optionsBankAccountStatus,
				optionsCurrency: $scope.optionsCurrency,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("BankAccounts-details", {
				action: "create",
				entity: {},
				optionsUsers: $scope.optionsUsers,
				optionsBankAccountType: $scope.optionsBankAccountType,
				optionsBankAccountStatus: $scope.optionsBankAccountStatus,
				optionsCurrency: $scope.optionsCurrency,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("BankAccounts-details", {
				action: "update",
				entity: entity,
				optionsUsers: $scope.optionsUsers,
				optionsBankAccountType: $scope.optionsBankAccountType,
				optionsBankAccountStatus: $scope.optionsBankAccountStatus,
				optionsCurrency: $scope.optionsCurrency,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete BankAccounts?',
				`Are you sure you want to delete BankAccounts? This action cannot be undone.`,
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
							messageHub.showAlertError("BankAccounts", `Unable to delete BankAccounts: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsUsers = [];
		$scope.optionsBankAccountType = [];
		$scope.optionsBankAccountStatus = [];
		$scope.optionsCurrency = [];

		$http.get("/services/js/dirigible-bank-server/gen/api/users/Users.js").then(function (response) {
			$scope.optionsUsers = response.data.map(e => {
				return {
					value: e.Id,
					text: e.FName
				}
			});
		});

		$http.get("/services/js/dirigible-bank-server/gen/api/entities/BankAccountType.js").then(function (response) {
			$scope.optionsBankAccountType = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/dirigible-bank-server/gen/api/entities/BankAccountStatus.js").then(function (response) {
			$scope.optionsBankAccountStatus = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/dirigible-bank-server/gen/api/Currencies/Currency.js").then(function (response) {
			$scope.optionsCurrency = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.optionsUsersValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsUsers.length; i++) {
				if ($scope.optionsUsers[i].value === optionKey) {
					return $scope.optionsUsers[i].text;
				}
			}
			return null;
		};
		$scope.optionsBankAccountTypeValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsBankAccountType.length; i++) {
				if ($scope.optionsBankAccountType[i].value === optionKey) {
					return $scope.optionsBankAccountType[i].text;
				}
			}
			return null;
		};
		$scope.optionsBankAccountStatusValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsBankAccountStatus.length; i++) {
				if ($scope.optionsBankAccountStatus[i].value === optionKey) {
					return $scope.optionsBankAccountStatus[i].text;
				}
			}
			return null;
		};
		$scope.optionsCurrencyValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsCurrency.length; i++) {
				if ($scope.optionsCurrency[i].value === optionKey) {
					return $scope.optionsCurrency[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
