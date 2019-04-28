var app = angular.module('app', []);

app.controller('myController', function myController($scope, $http) {
    $scope.allQuestions = {};

    $http.get("static/json/questions.json")
        .then(function success(data) {
            $scope.allQuestions = data.data;
            $scope.questions = $scope.allQuestions[$scope.subject];
        }, function error(data) {
            console.log("there was an error");
        });

    $scope.years = ['Any', 2012, 2013, 2014, 2015, 2016, 2017];
    $scope.sessions = ['Any', 'M', 'D'];

    $scope.$watch('subject', function (newSubject) {
        $scope.questions = $scope.allQuestions[newSubject];
        $scope.selectedQuestions = [];
    });

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
