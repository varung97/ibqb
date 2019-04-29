var app = angular.module('app', []);

app.controller('myController', function myController($rootScope, $scope, $http, $window) {
    $rootScope.$watch(function(){
      MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
      return true;
    });

    $scope.resetSelected = function() {
        $scope.selectedYear = ' Year';
        $scope.selectedSession = ' Session';
        $scope.selectedPaper = ' Paper';
        $scope.selectedLevel = ' Level';
        $scope.selectedTZ = ' TZ';
        $scope.selectedOuterSection = ' Topic';
    }

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
                    $scope.innerSections = [' Subtopic'].concat($scope.allQuestions[$scope.subject]['inner_sections'][newSelectedOuterSection]);
                }
                $scope.selectedInnerSection = ' Subtopic';
            });

            $scope.$watch('selectedInnerSection', function (newSelectedInnerSection) {
                if (newSelectedInnerSection[0] == ' ') {
                    $scope.innerInnerSections = [' Subsubtopic'];
                } else {
                    $scope.innerInnerSections = [' Subsubtopic'].concat($scope.allQuestions[$scope.subject]['inner_inner_sections'][newSelectedInnerSection]);
                }
                $scope.selectedInnerInnerSection = ' Subsubtopic';
            });

            $scope.$watch('allQuestions', function (newAllQuestions) {
                $scope.updateSelectors();
            });

            $scope.$watch('subject', function (newSubject) {
                $scope.updateSelectors();
                $scope.resetSelected();
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
                   $scope.matchSelected(question.inner_section, $scope.selectedInnerSection) &&
                   $scope.matchSelected(question.inner_inner_section, $scope.selectedInnerInnerSection);
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

    $scope.scrollToTop = function() {
        (function smoothscroll() {
            var currentScroll = $window.scrollY;
            if (currentScroll > 0) {
                $window.requestAnimationFrame(smoothscroll);
                $window.scrollTo(0, currentScroll - (currentScroll / 8));
            }
        })();
    }

    $scope.selectQuestion = function(question) {
        $scope.selectedQuestion = question.id;
        // $scope.scrollToTop();
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
            $window.open('/paper', '_blank');
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
            $window.open('/markscheme', '_blank');
        })
    }

    // angular.element($window).bind("scroll", function () {
    //     $scope.$apply(function() {
    //         $scope.questionPosition = Math.max(0, this.pageYOffset - 250);
    //     })
    // });
})
