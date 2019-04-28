var myApp = angular.module('myApp', []);

myApp.controller('myController', function myController($scope) {
    $scope.years = ['Any', 2012, 2013];
    $scope.sessions = ['Any', 'M', 'D'];
    $scope.questions = blah;
    $scope.selectedQuestions = [];

    $scope.matchSelected = function(actual, expected) {
        return expected == 'Any' || actual == expected;
    }

    $scope.applyFilters = function() {
        return function(question) {
            return $scope.matchSelected(question.year, $scope.selectedYear) &&
                   $scope.matchSelected(question.session, $scope.selectedSession);
        }
    }

    $scope.selectQuestion = function(question) {
        if ($scope.selectedQuestions.every(function(selectedQuestion) { return question.id != selectedQuestion.id})) {
            $scope.selectedQuestions.push(question);
        }
    }

    $scope.deselectQuestion = function(question) {
        $scope.selectedQuestions = $scope.selectedQuestions.filter(function(selectedQuestion, idx, arr) {
            return selectedQuestion.id != question.id;
        })
    }
})
