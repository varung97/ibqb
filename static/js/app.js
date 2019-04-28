var app = angular.module('app', []);

app.controller('myController', function myController($rootScope, $scope, $http) {
    $rootScope.$watch(function(){
      MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
      return true;
    });

    $scope.updateSelectors = function() {
        if (!$scope.allQuestions.hasOwnProperty($scope.subject)) {
            return;
        }
        $scope.years = [' Year'].concat($scope.allQuestions[$scope.subject]['years']);
        $scope.sessions = [' Session'].concat($scope.allQuestions[$scope.subject]['sessions']);
        $scope.papers = [' Paper'].concat($scope.allQuestions[$scope.subject]['papers']);
        $scope.levels = [' Level'].concat($scope.allQuestions[$scope.subject]['levels']);
        $scope.tzs = [' TZ'].concat($scope.allQuestions[$scope.subject]['tzs']);
        $scope.outerSections = [' Topic'].concat($scope.allQuestions[$scope.subject]['outer_sections']);
        $scope.questions = $scope.allQuestions[$scope.subject]['questions'];
    }

    $http.get("static/json/questions.json")
        .then(function success(data) {
            $scope.allQuestions = data.data;
            $scope.updateSelectors();

            $scope.$watch('selectedOuterSection', function (newSelectedOuterSection) {
                if (newSelectedOuterSection[0] == ' ') {
                    $scope.innerSections = [' Subtopic'];
                } else {
                    $scope.innerSections = [' Subtopic'].concat($scope.allQuestions[$scope.subject]['sections'][newSelectedOuterSection]);
                }
                $scope.selectedInnerSection = ' Subtopic';
            });

            $scope.$watch('allQuestions', function (newAllQuestions) {
                $scope.updateSelectors();
            });

            $scope.$watch('subject', function (newSubject) {
                $scope.updateSelectors();
                $scope.addedQuestions = [];
            });
        }, function error(data) {
            console.log("there was an error");
        });

    $scope.matchSelected = function(actual, expected) {
        return expected[0] == ' ' || actual == expected;
    }

    $scope.applyFilters = function() {
        return function(question) {
            return $scope.matchSelected(question.year, $scope.selectedYear) &&
                   $scope.matchSelected(question.session, $scope.selectedSession) &&
                   $scope.matchSelected(question.paper, $scope.selectedPaper) &&
                   $scope.matchSelected(question.level, $scope.selectedLevel) &&
                   $scope.matchSelected(question.tz, $scope.selectedTZ) &&
                   $scope.matchSelected(question.outer_section, $scope.selectedOuterSection) &&
                   $scope.matchSelected(question.inner_section, $scope.selectedInnerSection);
        }
    }

    $scope.addQuestion = function(question) {
        if ($scope.addedQuestions.every(function(addedQuestion) { return question.id != addedQuestion.id})) {
            $scope.addedQuestions.push(question);
        }
    }

    $scope.removeQuestion = function(question) {
        $scope.addedQuestions = $scope.addedQuestions.filter(function(addedQuestion) {
            return addedQuestion.id != question.id;
        })
    }

    $scope.selectQuestion = function(question) {
        $scope.selectedQuestion = question.id;
    }

    $scope.generatePaper = function() {
        $http({
            method: 'POST',
            url: '/generatePaper',
            headers: {'Content-Type': 'json'},
            data: {
                questions: $scope.addedQuestions.map(function(addedQuestion) {
                    return addedQuestion.id;
                }),
                subject: $scope.subject
            }
        }).then(function(response) {
            console.log(response.data);
        })
    }

    $scope.generateMarkscheme = function() {
        $http({
            method: 'POST',
            url: '/generateMarkscheme',
            headers: {'Content-Type': 'json'},
            data: {
                questions: $scope.addedQuestions.map(function(addedQuestion) {
                    return addedQuestion.id;
                }),
                subject: $scope.subject
            }
        }).then(function(response) {
            console.log(response.data);
        })
    }
})
