angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'dirigible-bank-server.bankAccount.BankAccounts';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/dirigible-bank-server/gen/api/bankAccount/BankAccountsService.ts";
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
			$scope.loadPage($scope.dataPage, $scope.filter);
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
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
			$scope.dataPage = pageNumber;
			entityApi.count(filter).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("BankAccounts", `Unable to count BankAccounts: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				let request;
				if (filter) {
					filter.$offset = offset;
					filter.$limit = limit;
					request = entityApi.search(filter);
				} else {
					request = entityApi.list(offset, limit);
				}
				request.then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("BankAccounts", `Unable to list/filter BankAccounts: '${response.message}'`);
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
		$scope.loadPage($scope.dataPage, $scope.filter);

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
			});
		};

		$scope.openFilter = function (entity) {
			messageHub.showDialogWindow("BankAccounts-filter", {
				entity: $scope.filterEntity,
				optionsUsers: $scope.optionsUsers,
				optionsBankAccountType: $scope.optionsBankAccountType,
				optionsBankAccountStatus: $scope.optionsBankAccountStatus,
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
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("BankAccounts-details", {
				action: "update",
				entity: entity,
				optionsUsers: $scope.optionsUsers,
				optionsBankAccountType: $scope.optionsBankAccountType,
				optionsBankAccountStatus: $scope.optionsBankAccountStatus,
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
						$scope.loadPage($scope.dataPage, $scope.filter);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsUsers = [];
		$scope.optionsBankAccountType = [];
		$scope.optionsBankAccountStatus = [];


		$http.get("/services/ts/dirigible-bank-server/gen/api/users/UsersService.ts").then(function (response) {
			$scope.optionsUsers = response.data.map(e => {
				return {
					value: e.Id,
					text: e.FName
				}
			});
		});

		$http.get("/services/ts/dirigible-bank-server/gen/api/entities/BankAccountTypeService.ts").then(function (response) {
			$scope.optionsBankAccountType = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/dirigible-bank-server/gen/api/entities/BankAccountStatusService.ts").then(function (response) {
			$scope.optionsBankAccountStatus = response.data.map(e => {
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
		//----------------Dropdowns-----------------//

	}]);
