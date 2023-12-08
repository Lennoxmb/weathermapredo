(function () {



    function appendLeadingZeroes(n){
        if(n <= 9){
            return "0" + n;
        }
        return n;
    }


    function windCardinalDirection(degrees){
        let cardinalDirection = '';
        if ((degrees > 348.75 && degrees <= 360) || (degrees >=0 && degrees <= 11.25)){
            cardinalDirection = "N";
        } else if (degrees > 11.25 && degrees  <= 33.75) {
            cardinalDirection = "NNE";
        } else if (degrees > 33.75 && degrees <= 56.25) {
            cardinalDirection = "NE";
        } else if (degrees > 56.25 && degrees <= 78.75) {
            cardinalDirection = "ENE";
        } else if (degrees > 78.75 && degrees <= 101.25) {
            cardinalDirection = "E";
        } else if (degrees > 101.25 && degrees <= 123.75) {
            cardinalDirection = "ESE";
        } else if (degrees > 123.75 && degrees <= 146.25) {
            cardinalDirection = "SE";
        } else if (degrees > 146.25 && degrees <= 168.75) {
            cardinalDirection = "SSE";
        } else if (degrees > 168.75 && degrees <= 191.25) {
            cardinalDirection = "S";
        } else  if (degrees > 191.25 && degrees <= 213.75) {
            cardinalDirection = "SSW";
        } else if (degrees > 213.75 && degrees <= 236.25)  {
            cardinalDirection = "SW";
        } else if (degrees > 236.25 && degrees <= 258.75) {
            cardinalDirection = "WSW";
        } else if (degrees > 258.75 && degrees <= 281.25) {
            cardinalDirection = "W";
        } else if (degrees > 281.25 && degrees <= 303.75) {
            cardinalDirection = "WNW";
        } else if (degrees > 303.75 && degrees <= 326.25) {
            cardinalDirection = "NW";
        } else if (degrees > 326.75 && degrees <= 348.75) {
            cardinalDirection = "NNW";
        }
        return cardinalDirection;
    }

    const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];


    function formatTime(timeStamp){
        let dateTime = new Date(timeStamp * 1000);
        let year = dateTime.getFullYear();
        let month = months[dateTime.getMonth()];
        let day = dateTime.getDate();
        let hour = appendLeadingZeroes(dateTime.getHours());
        let minutes = appendLeadingZeroes(dateTime.getMinutes());
        let seconds = appendLeadingZeroes(dateTime.getSeconds());
        return month + " " + day + " " + year + " " + hour + ":" + minutes + ":" + seconds;
    }

    function dateFromTimeStamp(timeStamp){
        let dateTime = new Date(timeStamp * 1000);
        let year = dateTime.getFullYear();
        let month = appendLeadingZeroes(dateTime.getMonth() + 1);
        let day = dateTime.getDate();
        return `${month}-${day}`;
    }

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const daysOfWeekAbbreviated = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    function namedDayFromDay(timeStamp){
        let dateTime = new Date(timeStamp * 1000);
        return daysOfWeek[dateTime.getDay()];
    }

    function dayOfWeekFromDayAbbreviated(timeStamp){
        let dateTime = new Date(timeStamp * 1000);
        return daysOfWeekAbbreviated[dateTime.getDay()];
    }

    function mostFrequent(array){
        const arrayElementsCount = array.reduce(function(total, element){
            if (!total[element]) {
                total[element] = 1;
            } else {
                total[element] = total[element] + 1;
            }
            return total;
        }, {});
        const arraySorted = Object.entries(arrayElementsCount).sort(function(a, b){
            return b[1] - a[1];
        });
        return arraySorted[0][0];
    }

    function average(array){
        let total = 0;
        array.forEach((element, index, array)=>total+=element);
        return total/array.length;
    }


//TODAYS WEATHER FUNCTION

    function todaysWeather(location) {
        console.log(location)
        geocode(location, MAPBOX_API_TOKEN).then(coords => {
            $.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coords[1]}&lon=${coords[0]}&appid=${OPEN_WEATHER_APPID}&units=imperial`).done
            (data => {
                const time = new Date();
                $(`<img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png">`)
                $('#todaysDate').html(`<p>${daysOfWeek[time.getDay()]}<br>${months[time.getMonth()]}  ${time.getDate()}  ${time.getHours()}:${appendLeadingZeroes(time.getMinutes())}<br> Location: ${data.name}</p>`)
                $('#weather').html(`<p>Weather: ${data.weather[0].description}<br>Current Temp: ${data.main.temp}<br>Feel like temp: ${data.main.feels_like}</p>`)
                $('#details').html(`<p>Humidity: ${data.main.humidity}<br>Today's High: ${data.main.temp_max}<br>Today's Low: ${data.main.temp_min}</p>`)
            });
        });
    }

//san antonio location marker

    new mapboxgl.Marker()
        .setLngLat([-98.4936300, 29.4241200])
        .addTo(map);


    todaysWeather('San Antonio, TX')


//  FORECAST FUNCTION
    function weatherForecast(location) {
        geocode(location, MAPBOX_API_TOKEN).then(coords => {
            $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${coords[1]}&lon=${coords[0]}&appid=${OPEN_WEATHER_APPID}&units=imperial`)
                .done(function (data) {
                    let fiveDayForecast = '';
                    data.list.forEach((forecast, index) => {
                        if (index % 8 === 0 && index !== 0) {
                            const time = new Date(forecast.dt * 1000);
                            fiveDayForecast += `
                            <div class="forecast" id="day${index}">
                              
                              ${daysOfWeekAbbreviated[time.getDay()]} ${dateFromTimeStamp(forecast.dt)}<br><br>Weather: ${forecast.weather[0].description}<br>Average Temp: ${forecast.main.temp}
                            </div>
                            `;
                        }
                    })
                    $('.fivedayForecastBox').html(fiveDayForecast);
                });
        })
    }

    weatherForecast('San Antonio, TX')


//TOGGLE FORECAST OPEN AND CLOSED
    function toggleContainer() {
        let container = document.getElementById('fiveDayForecast');
        container.classList.toggle('hidden');
    }

//ZOOM FUNCTION
    document.getElementById("zoomSubmit").addEventListener('click', event => {
        event.preventDefault();
        map.setZoom(document.getElementById("zoom").value);
    });

//CLEAR MARKERS FUNCTION
    map.on('click', function(e) {
        document.querySelectorAll(".mapboxgl-marker").forEach(svg=>{
            svg.style.display = 'none';
        })
    })


//map click and clear marker click
    let markers = [new mapboxgl.Marker()
        .setLngLat([-98.4936300, 29.4241200])
        .addTo(map)];
    map.on('click', function(e) {
        for (let i = 0; i < markers.length; i++) {
            markers[i].remove();
        }
        let marker = new mapboxgl.Marker()
            .setLngLat(e.lngLat)
            .addTo(map);
        markers.push(marker);
        let coordy = (e.lngLat)

        $.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coordy.lat}&lon=${coordy.lng}&appid=${OPEN_WEATHER_APPID}&units=imperial`).done
        (data => {
            const time = new Date();
            $('#todaysDate').html(`<p>${daysOfWeek[time.getDay()]}<br>${months[time.getMonth()]}  ${time.getDate()}  ${time.getHours()}:${appendLeadingZeroes(time.getMinutes())}<br> Location: ${data.name}</p>`)
            $('#weather').html(`<p>Weather: ${data.weather[0].description}<br>Current Temp: ${data.main.temp}<br>Feel like temp: ${data.main.feels_like}</p>`)
            $('#details').html(`<p>Humidity: ${data.main.humidity}<br>Today's High: ${data.main.temp_max}<br>Today's Low: ${data.main.temp_min}</p>`)
        });
        $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordy.lat}&lon=${coordy.lng}&appid=${OPEN_WEATHER_APPID}&units=imperial`)
            .done(function (data) {
                let fiveDayForecast = '';
                data.list.forEach((forecast, index) => {
                    if (index % 8 === 0 && index !== 0) {
                        const time = new Date(forecast.dt * 1000);
                        fiveDayForecast += `
                            <div class="forecast" id="day${index}">
                              
                              ${daysOfWeekAbbreviated[time.getDay()]} ${dateFromTimeStamp(forecast.dt)}<br><br>Weather: ${forecast.weather[0].description}<br>Average Temp: ${forecast.main.temp}
                            </div>
                            `;
                    }
                })
                $('.fivedayForecastBox').html(fiveDayForecast);
            });
    });


//CLEAR MARKERS FUNCTION
    document.querySelector("#searchAddress").addEventListener('click', event=>{
        document.querySelectorAll(".mapboxgl-marker").forEach(svg=>{
            svg.style.display = 'none';
        })
    })

//NEW ADDRESS FUNCTION
    document.getElementById("setMarkerButton").addEventListener('click', async (event)=>{
        event.preventDefault();
        const address = document.getElementById("setMarker").value;
        todaysWeather(address);
        weatherForecast(address);
        let coords = await geocode(address, MAPBOX_API_TOKEN);
        const newMarker = new mapboxgl.Marker()
            .setLngLat(coords)
            .addTo(map);
        map.flyTo({
            center: coords,
            zoom: 9,
            speed: 2,
            curve: 1,
            easing(t) {
                return t;
            }
        });
    });



    //ZOOM IN AND OUT BUTTONS
    map.addControl(new mapboxgl.NavigationControl());


})();

