angular.module('page', ["ideUI", "ideView"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'dirigible-bank-server.cards.Cards';
	}])
	.controller('PageController', ['$scope', 'messageHub', 'ViewParameters', function ($scope, messageHub, ViewParameters) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			if (params?.entity?.ExpirationDateFrom) {
				params.entity.ExpirationDateFrom = new Date(params.entity.ExpirationDateFrom);
			}
			if (params?.entity?.ExpirationDateTo) {
				params.entity.ExpirationDateTo = new Date(params.entity.ExpirationDateTo);
			}
			$scope.entity = params.entity ?? {};
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsUsers = params.optionsUsers;
			$scope.optionsCardType = params.optionsCardType;
		}

		$scope.filter = function () {
			let entity = $scope.entity;
			const filter = {
				$filter: {
					equals: {
					},
					notEquals: {
					},
					contains: {
					},
					greaterThan: {
					},
					greaterThanOrEqual: {
					},
					lessThan: {
					},
					lessThanOrEqual: {
					}
				},
			};
			if (entity.Id) {
				filter.$filter.equals.Id = entity.Id;
			}
			if (entity.Users) {
				filter.$filter.equals.Users = entity.Users;
			}
			if (entity.CardNumber) {
				filter.$filter.contains.CardNumber = entity.CardNumber;
			}
			if (entity.ExpirationDateFrom) {
				filter.$filter.greaterThanOrEqual.ExpirationDate = entity.ExpirationDateFrom;
			}
			if (entity.ExpirationDateTo) {
				filter.$filter.lessThanOrEqual.ExpirationDate = entity.ExpirationDateTo;
			}
			if (entity.CardType) {
				filter.$filter.equals.CardType = entity.CardType;
			}
			messageHub.postMessage("entitySearch", {
				entity: entity,
				filter: filter
			});
			$scope.cancel();
		};

		$scope.resetFilter = function () {
			$scope.entity = {};
			$scope.filter();
		};

		$scope.cancel = function () {
			messageHub.closeDialogWindow("Cards-filter");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);