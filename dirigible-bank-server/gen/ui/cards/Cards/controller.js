angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'dirigible-bank-server.cards.Cards';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/dirigible-bank-server/gen/api/cards/Cards.js";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', function ($scope, $http, messageHub, entityApi) {

		//-----------------Custom Actions-------------------//
		$http.get("/services/js/resources-core/services/custom-actions.js?extensionPoint=dirigible-bank-server-custom-action").then(function (response) {
			$scope.pageActions = response.data.filter(e => e.perspective === "cards" && e.view === "Cards" && (e.type === "page" || e.type === undefined));
			$scope.entityActions = response.data.filter(e => e.perspective === "cards" && e.view === "Cards" && e.type === "entity");
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
					messageHub.showAlertError("Cards", `Unable to count Cards: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				entityApi.list(offset, limit).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("Cards", `Unable to list Cards: '${response.message}'`);
						return;
					}

					response.data.forEach(e => {
						if (e.ExpirationDate) {
							e.ExpirationDate = new Date(e.ExpirationDate);
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
			messageHub.showDialogWindow("Cards-details", {
				action: "select",
				entity: entity,
				optionsUsers: $scope.optionsUsers,
				optionsCardType: $scope.optionsCardType,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("Cards-details", {
				action: "create",
				entity: {},
				optionsUsers: $scope.optionsUsers,
				optionsCardType: $scope.optionsCardType,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("Cards-details", {
				action: "update",
				entity: entity,
				optionsUsers: $scope.optionsUsers,
				optionsCardType: $scope.optionsCardType,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete Cards?',
				`Are you sure you want to delete Cards? This action cannot be undone.`,
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
							messageHub.showAlertError("Cards", `Unable to delete Cards: '${response.message}'`);
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
		$scope.optionsCardType = [];

		$http.get("/services/js/dirigible-bank-server/gen/api/users/Users.js").then(function (response) {
			$scope.optionsUsers = response.data.map(e => {
				return {
					value: e.Id,
					text: e.FName
				}
			});
		});

		$http.get("/services/js/dirigible-bank-server/gen/api/entities/CardType.js").then(function (response) {
			$scope.optionsCardType = response.data.map(e => {
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
		$scope.optionsCardTypeValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsCardType.length; i++) {
				if ($scope.optionsCardType[i].value === optionKey) {
					return $scope.optionsCardType[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
