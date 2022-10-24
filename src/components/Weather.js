import axios from "axios";
import reducer from "../reducer";
import icons from "../assets/icons";
import { toast } from "react-toastify";
import { Loading, Form } from "./index";
import { useEffect, useReducer, useState } from "react";
import { dayImg, nightImg } from "../assets/images";
import { SET_LOADING, UPDATE_SEARCH, SET_ERROR, SET_DATA } from "../assets/actions";

const key = process.env.REACT_APP_KEY;
const cityBase = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${key}&`;
const weatherBase = `http://dataservice.accuweather.com/currentconditions/v1/locationKey?apikey=${key}&`;
const storageCity = localStorage.cityWeather || "";
const storageDark = localStorage.darkWeather ? JSON.parse(localStorage.darkWeather) : false;

const initialState = {
    search: storageCity,
    showCard: false,
    isLoading: false,
    error: {show: false, msg: ""},
    objects: {cityObject: {}, weatherObject: {}}
}

const Weather = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [darkMode, setDarkMode] = useState(storageDark);
    
    const fetchData = async () => {
        dispatch({type: SET_LOADING});
        const cityResponse = await axios(`${cityBase}q=${state.search}`)
        .catch(error => dispatch({type: SET_ERROR, payload: error.message}));

        if(!cityResponse) return;
        if(cityResponse.data.length < 1) dispatch({type: SET_ERROR, payload: "Couldn't find that place, try something else."});
        if(cityResponse.data.length > 0){
            const cityObject = cityResponse.data[0];
            const weatherResponse = await axios(`${weatherBase}locationKey=${cityObject.Key}`)
            .catch(error => dispatch({type: SET_ERROR, payload: error.message}));

            if(!weatherResponse) return;
            else {
                const weatherObject = weatherResponse.data[0];
                dispatch({type: SET_DATA, payload: {cityObject, weatherObject}});
                localStorage.setItem("cityWeather", state.search);
                toast.success("Weather acquired :)");
            }
        }
    }

    useEffect(() => {
        if(state.search) fetchData();
        // eslint-disable-next-line
    }, [])
    useEffect(() => {
        if(darkMode) document.documentElement.className = "dark-mode";
        else document.documentElement.className = "";
        localStorage.setItem("darkWeather", JSON.stringify(darkMode));
    }, [darkMode])

    const toggleDark = () => setDarkMode(!darkMode);
    const handleChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        dispatch({type: UPDATE_SEARCH, payload: {name, value}})
    }
    const handleSubmit = e => {
        e.preventDefault();
        if(state.isLoading) return
        if(!state.search){
            toast.warning("Please enter a location")
            return
        }
        fetchData();
    }

    if(state.isLoading){
        return (
            <section className="container">
                <Form search={state.search} error={state.error} handleChange={handleChange} handleSubmit={handleSubmit} toggleDark={toggleDark} />
                <Loading />
            </section>
        )
    }
    if(!state.showCard){
        return (
            <section className="container">
                <Form search={state.search} error={state.error} handleChange={handleChange} handleSubmit={handleSubmit} toggleDark={toggleDark} />
            </section>
        )
    }
    const { EnglishName: cityName, Country: {EnglishName: countryName} } = state.objects.cityObject;
    const { IsDayTime, WeatherIcon, WeatherText, Temperature: {Metric: {Value}} } = state.objects.weatherObject;
    return (  
        <section className="container">

            <Form search={state.search} error={state.error} handleChange={handleChange} handleSubmit={handleSubmit} toggleDark={toggleDark} />

            <article className="card">
                <div className="img-div lh-0">
                    <img src={IsDayTime ? dayImg : nightImg} alt="placeholder" className="img"/>
                </div>

                <div className="icon-div">
                    <img src={icons[WeatherIcon]} alt="dada" className="img"/>
                </div>

                <div className="info ta-center">
                    <h2 className="city fw-400 mb-8">{cityName}</h2>
                    <h5 className="country fw-400 mb-12">{countryName}</h5>
                    <p className="condition">{WeatherText}</p>
                    <p className="degrees">{Value} °C</p>
                </div>
            </article>
      </section>
    );
}
 
export default Weather;