$(document).ready(function () {
  const API = "dbd602c82924434b500e381cf91341b2";

  // location

  // get location from user
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  // get to pos for api
  function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var Location = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

    // send pos to api and get city
    $.ajax({
      type: "Get",
      url: Location,
      data: "data",
      dataType: "json",
      success: function (data) {
        var UserCity = data.city;
        GetTemp(UserCity);
        $(".Allow-loc").remove();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
      },
    });
  }
  getLocation();
  $(".Allow").on("click", function () {
    // if user use firefox reload the page for location
    if (window.navigator.userAgent.indexOf("Firefox") != -1) {
      location.reload();
    } else {
      getLocation();
      $(".Allow-loc").remove();
    }
  });

  $("#Close").on("click", function () {
    $(".Allow-loc").remove();
  });
  // get today date
  var d = new Date();
  var Months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  function calcDay(d) {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }
  // set day and month
  $(".Month").text(Months[d.getMonth()]);

  $(".day").text(d.getDay() + calcDay(d.getDay()));

  $(".btn").on("click", function () {
    GetTemp($(".get-city").val());
  });

  // procces by enter
  let InputCity = document.getElementsByClassName("get-city");

  InputCity[0].addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 13) {
      GetTemp($(".get-city").val());
    }
  });
  function GetTemp(City) {
    $.ajax({
      type: "Get",
      url: `http://api.openweathermap.org/data/2.5/weather?q=${City}&appid=${API}`,
      data: "data",
      dataType: "json",
      success: function (data) {
        // set name city or country
        $("h1").text(data.name);

        // // set icon
        var ico = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        $(".icon-W").attr("src", ico);

        // weather type like cloudy or sunny - set humidity
        $(".weather-type").text(data.weather[0].main);
        $(".humidity").text(data.main.humidity);
        $(".temp-C").text((data.main.temp - 273.15).toFixed(2) + "ºC");
      },

      error: function (jqXHR, textStatus, errorThrown) {
        if (City == "") {
          alert("Fill the input");
        } else {
          // set warning icon
          $(".icon-W").addClass("None");
          $(".Warning").removeClass("None");
          // hide other text in black box and set Not Found
          $(".temp-p").text("");
          $(".temp-C").text("Not Found");
          // set User word in White box
          $("h1").text(City);

          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        }
      },
    });
    $(".get-city").val("");
  }
});
