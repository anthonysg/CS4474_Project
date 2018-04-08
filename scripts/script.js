var userData, courseData, fallData, winterData, addLocation, self, major, minor;

// Progress bar for major
function majorProgress() {
    var major = $(".course").length;
    $("#major-progress-text").text(major/2 + " / 20");
    $("#progress-major #progressbar").progressbar({
        value: Math.floor(major * 2.5)
    });
}

// Progress bar for minor
function minorProgress() {
    var minor = $(".panel").first().find(".course").length;
    $("#minor-progress-text").text(minor/2 + " / 5");
    $("#progress-minor #progressbar").progressbar({
        value: minor * 10
    });
}

// Check which image to use for courses
function courseImage(courseName) {
    var image;
    var course = courseName.split(" ", 1);
    switch(course[0]) {
        case "COMPSCI":
            image = "images/icon-workstation-20.png";
            break;
        case "ENGLISH":
            image = "images/icon-write-20.png";
            break;
        case "WRITING":
            image = "images/icon-write-20.png";
            break;
        case "MUSIC":
            image = "images/icon-music-20.png";
            break;
        case "DIGIHUM":
            image = "images/icon-light-on-20.png";
            break;
        case "GEOGRAPH":
            image = "images/icon-world-20.png";
            break;
        case "PSYCHOL":
            image = "images/icon-brain-20.png";
            break;
        case "CALCULUS":
            image = "images/icon-math-20.png";
            break;
        case "PHYSICS":
            image = "images/icon-physics-20.png";
            break;
        case "STATS":
            image = "images/icon-chart-20.png";
            break;
        default:
            image = "images/icon-workstation-20.png"
    }
    return image;
}

// Change the dataset used for autocompletion
function courseAutocomplete(data) {
    // Search for courses
    $("#search-course").autocomplete({
        search: function(event, ui) {
            $('#modal-results').empty();
        },
        source: data,
        minLength: 1
    }).data("uiAutocomplete")._renderItem = function (ul, item) {

        return $('<li/>')
       .data('item.uiAutocomplete', item)
       .append(item.value)
       .appendTo($('#modal-results'));
    };
    $(document).on("click", "#modal-results>li", function() {
        $(this).parent().find("li").removeClass("ui-state-active");
        $(this).addClass('ui-state-active');
    });
}

// Change the content of the alert
function alertText(html) {
    $('.alert-text').empty();
    $('.alert-text').append(html);
}

$(document).ready(function() {

    // Retrieve the object from storage
    var savedUser = localStorage.getItem('userData');

    fallData = [];
    winterData = [];

    // Cleans json from duplicates
    // var clean = [];

    // $.each(data, function(index, value) {
    //     if($.inArray(value.course, clean) == -1)
    //     {
    //         clean.push(value.course);
    //     }
    // });

    // console.log(JSON.stringify(clean));

    jsonCourses = JSON.parse(jsonCourses);

    jsonCourses.fall.forEach(function(e) {
        fallData.push(e.course);
    });

    jsonCourses.winter.forEach(function(e) {
        winterData.push(e.course);
    });

    fallData.sort();
    winterData.sort();

    courseData = fallData.concat(winterData);
    courseData.sort();

    // Get json from file if not in local storage
    if(savedUser == null) {
        userCallback(JSON.parse(jsonUser));
    } else {
        userCallback(JSON.parse(savedUser));
    }

    var degreeModal = document.getElementById('degree-modal');
    var courseModal = document.getElementById('course-modal');

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == degreeModal) {
            $(degreeModal).hide();
            $(".alert").hide();
        }
        if (event.target == courseModal) {
            $(courseModal).hide();
            $(".alert").hide();
        }
    } 

    // Fadeout for alert
    $(".closebtn").click(function() {
        $(".alert").fadeOut(300);
    });

    // Things to do after getting user data
    function userCallback(data) {

        userData = data;

        // Put the object into storage
        localStorage.setItem('userData', JSON.stringify(userData));

        Handlebars.registerHelper('checklength', function (v1, v2, options) {
            'use strict';
            if (v1.length>v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        });

        Handlebars.registerHelper("courseImage", function(course) {
            return courseImage(course);
        });

        // Compile template
        var template = Handlebars.compile($('#course-year').html());
        Handlebars.registerPartial("course", $('#course-partial').html());

        // Render template
        var courseHTML = template(userData);
        $("#course-registration").append(courseHTML);

        Handlebars.unregisterPartial("course");

        // Accordion
        var acc = document.getElementsByClassName("accordion");
        var i;

        for (i = 0; i < acc.length; i++) {
          acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight){
              panel.style.maxHeight = null;
            } else {
              panel.style.maxHeight = "515px";
            } 
          });
        }            

        // Toggle between hiding and showing the dropdown content
        $(".dropbtn").click(function(e) {
            e.stopPropagation();
            $(".dropdown-content").removeClass("show"); // hide other menus
            $(this).parent().find(".dropdown-content").toggleClass("show");
        });

        // Close the dropdown if the user clicks outside of it
        $("body").click(function() {
            $(".dropdown-content").removeClass("show");
        });

        majorProgress();
        minorProgress();

        // Click first course accordion to open for user
        $(".accordion").first().click();

        // Search for nav
        $(function() {
            var availableTags = [];
            $('.course').find("span").each(function(){
                availableTags.push($(this).text());
            });
            availableTags.sort();
            $("#search-nav").autocomplete({
                source: availableTags
            });
        });

        // Displays Modal on add course click
        $(".add-course").click(function() {
            $('#modal-results').empty();
            $('#modal-results').append('<img class="modal-img" src="images/img-lighthouse.png"><p id="modal-search">Nothing has been searched yet!</p>');
            $("#search-course").val("");
            var semester = $(this).parent().attr('id');
            if(semester == "fall-courses") {
                courseAutocomplete(fallData);
            } else if(semester == "winter-courses") {
                courseAutocomplete(winterData);
            } else if(semester == "all-courses") {
                courseAutocomplete(courseData);
            }
            $("#course-modal").show();
            $("#search-course").focus()
            addLocation = $(this);
        });

        // Displays Modal on add course click
        $("#profile").click(function() {
            $("#degree-modal").show();
            addLocation = $(this);
        });

        // Removes course when pressed
        $(".remove-course").click(function() {
            $(this).closest(".courses").find(".add-course").removeClass("hidden");
            var semester = $(this).closest(".courses").attr("id")
            var course = $(this).closest(".course").find('span').text();
            if(semester == "fall-courses") {
                $.each(userData.semesters[0].semester.fall, function(index, value) {
                    if(course == value.course) {
                        userData.semesters[0].semester.fall.splice(index, 1);
                        return false;
                    }
                });
                localStorage.setItem('userData', JSON.stringify(userData));
            } else if(semester == "winter-courses") {
                $.each(userData.semesters[0].semester.winter, function(index, value) {
                    if(course == value.course) {
                        userData.semesters[0].semester.winter.splice(index, 1);
                        return false;
                    }
                });
                localStorage.setItem('userData', JSON.stringify(userData));
            }
            $(this).closest(".course").remove();
            minorProgress();
            majorProgress();
        });

        // Hides model on (x) click
        $(".close").click(function() {
            $(".modal").hide();
        });

        // Add course button
        $("#modal-button").click(function(){
            var courseTemplate = Handlebars.compile($('#course-partial').html());
            var name = $('#modal-results').find('.ui-state-active').text();
            if(name.length == 0) {
                alertText('<strong>Error</strong>: Class not selected');
                if($(".alert").css("display") == "block") {
                    $(".alert").effect("shake", {times:3, distance:10}, 400);
                } else {
                    $(".alert").fadeIn(300);
                }
                return;
            }
            var addCourse = courseTemplate({course: name});
            if($(addLocation).parent().attr("id") == "all-courses") {
                var courseCode = name.split(" ", 2)[1].slice(-1);
                if(courseCode == 'A' || courseCode == 'F')
                    self = $("#fall-courses").find(".add-course");
                else
                    self = $("#winter-courses").find(".add-course");
                if($(self).closest(".courses").find(".course").length >= 5) {
                    alertText('<strong>Error</strong>: Semester full');
                    if($(".alert").css("display") == "block") {
                        $(".alert").effect("shake", {times:3, distance:10}, 400);
                    } else {
                        $(".alert").fadeIn(300);
                    }
                    return;
                }
                // add here
                self.before(addCourse);
                self = self.prev();
            } else {
                $(addLocation).before(addCourse);
                self = $(addLocation).prev();
            }
            // Toggle between hiding and showing the dropdown content
            self.find(".dropbtn").click(function(e) {
                e.stopPropagation();
                $(".dropdown-content").removeClass("show"); // hide other menus
                $(this).parent().find(".dropdown-content").toggleClass("show");
            });
            // Removes course when pressed
            self.find(".remove-course").click(function() {
                $(this).closest(".courses").find(".add-course").removeClass("hidden");
                var semester = $(this).closest(".courses").attr("id")
                var course = $(this).closest(".course").find('span').text();
                if(semester == "fall-courses") {
                    $.each(userData.semesters[0].semester.fall, function(index, value) {
                        if(course == value.course) {
                            userData.semesters[0].semester.fall.splice(index, 1);
                            return false;
                        }
                    });
                    localStorage.setItem('userData', JSON.stringify(userData));
                } else if(semester == "winter-courses") {
                    $.each(userData.semesters[0].semester.winter, function(index, value) {
                        if(course == value.course) {
                            userData.semesters[0].semester.winter.splice(index, 1);
                            return false;
                        }
                    });
                    localStorage.setItem('userData', JSON.stringify(userData));
                }
                $(this).closest(".course").remove();
                minorProgress();
                majorProgress();
            });
            if($(self).closest(".courses").find(".course").length >= 5) {
                $(self).closest(".courses").find(".add-course").addClass("hidden");
            }
            var semester = self.parent().attr("id");
            var course = self.find("span").text();
            if(semester == "fall-courses") {
                userData.semesters[0].semester.fall.push({"course": course});
                localStorage.setItem('userData', JSON.stringify(userData));
            } else if(semester == "winter-courses") {
                userData.semesters[0].semester.winter.push({"course": course});
                localStorage.setItem('userData', JSON.stringify(userData));
            }
            minorProgress();
            majorProgress();
            $(".alert").fadeOut(300);
            $("#course-modal").hide();
        });
    }
});