STORAGE_ID = 'cities-weather'

var saveToLocalStorage = function () {
  localStorage.setItem(STORAGE_ID, JSON.stringify(weatherObject.citylist));
}

var getFromLocalStorage = function() {
  return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
}


var fetchWeater = function (city) {
    $.ajax({
        method: "GET",
        url: 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&APPID=9841c254b7cf9e4388aa1d7ba1b643a4',
        success: function (data) {
            console.log(data);
            createWeatherArray(data);
            renderWeather();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
};

var weatherObject = {
    citylist: getFromLocalStorage()
};
var createWeatherArray = function (data) {
    var name = data.name;
    var temp = data.main.temp;
    var chosenCity = {
        name: name,
        temp: temp,
        commentsObject: {comments:[]}
    };
     weatherObject.citylist.push(chosenCity);
     saveToLocalStorage();
 };

    var _findPostByName = function (city) {
        for (var i = 0; i < weatherObject.citylist.length; i++) {
            if (city === weatherObject.citylist[i].name) {
                return weatherObject.citylist[i];
            }
        }
    }

    var createCommentArray = function (comment, city) {
        var currentPost = _findPostByName(city);
        var newComment = {
            text: comment
        };
        currentPost.commentsObject.comments.push(newComment);
        console.log(weatherObject);
        saveToLocalStorage();
    };


    var removeCity = function(city) {
        currentPost = _findPostByName(city);
        weatherObject.citylist.splice(weatherObject.citylist.indexOf(currentPost), 1);
        saveToLocalStorage();
    }

    var renderWeather = function () {
        $('.results').empty();
        var source = $('#weather-template').html();
        var template = Handlebars.compile(source);
        var newHTML = template(weatherObject);
        $('.results').append(newHTML);
    };

    $('.city-form').on('submit', function () {
        var city = $(this).find('.form-group').find('.inputCity').val();
        fetchWeater(city);
        $(this).find('.form-group').find('.inputCity').val("");
    });

    $('.results').on('click', '.comment-btn', function () {
        var comment = $(this).siblings('.form-group').find('.inputComment').val();
        var city = $(this).parents('.result').find('.city-name').html();
        createCommentArray(comment, city);
        $(this).siblings('.form-group').find('.inputComment').val("");
        renderWeather();
    });

    $('.results').on('click', '.fa-trash', function(){
        var city = $(this).siblings('.city-name').html();
        removeCity(city);
        renderWeather();
    })

    renderWeather();