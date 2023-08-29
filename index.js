const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");

// old tab means current tab 
// new tab means clicked tab 
let currentTab=userTab;
const API_KEY = "168771779c71f3d64106d8a88376808a";
currentTab.classList.add("current-tab");
getfromSessionStorage();
function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");
        

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            // taking current location 
            getfromSessionStorage();
        }
    }
}


userTab.addEventListener("click",()=>{
    // pass clicked tab as input paramete
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    // pass clicked tab as input paramete
    switchTab(searchTab);
});

// check if coordinates are already present in session storage 
function getfromSessionStorage() {
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    // console.log(localCoordinates);
    if(!localCoordinates){
        // we are unable to find local coordinates 
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
        // console.log(coordinates);
    }
}


async function fetchUserWeatherInfo(coordinates){
    const {lat, lon}=coordinates;
    //make grantcontainer invisible;
    if(grantAccessContainer.classList.contains("active"))
        grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // api call 
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data=await response.json();
        console.log(data);
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        // add more
    }

}

function renderWeatherInfo(weatherInfo) {
    // fetching elements to in which  i have to add data
    
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");
    
    // fetch values from weather info object 
    cityName.innerText=weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText= weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText= `${weatherInfo?.main?.temp} °C`  ;
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
}

const grantAccessButton=document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click",getlocation);

function getlocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{ 
        alert("Geolocation is not supported by this browser");
        // show alert for no geoloction support
        
    }
}

function showPosition(position) {
    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
 

const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName=="")
        return;
    else
        fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    if(userInfoContainer.classList.remove("active"))
        userInfoContainer.classList.remove("active");
    if(grantAccessContainer.classList.contains("active"))
        grantAccessContainer.classList.remove("active");
    // console.log(city);
    try{
        // console.log(city);
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        // console.log(city);
        loadingScreen.remove("active");
        userInfoContainer.classList.add("active");
        // console.log(data);
        renderWeatherInfo(data);
    }
    catch(err){
        // alert ir error 404 img
    }

}






















