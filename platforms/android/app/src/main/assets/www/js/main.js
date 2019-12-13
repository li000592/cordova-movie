let ready = "cordova" in window ? "deviceready" : "DOMContentLoaded";


const imgSizes = {
    backdrop_sizes: ["w300", "w780", "w1280", "original"],
    logo_sizes: ["w45", "w92", "w154", "w185", "w300", "w500", "original"],
    poster_sizes: ["w92", "w154", "w185", "w342", "w500", "w780", "original"],
    profile_sizes: ["w45", "w185", "h632", "original"],
    still_sizes: ["w92", "w185", "w300", "original"]
};

const app = {
    active: "home",
    page: [],
    url: "",
    API_KEY: "cdcd019cddc314b00c037a97ca80b1b6",
    apiURL: "https://api.themoviedb.org/3/search/person?",
    imgURL: "https://image.tmdb.org/t/p",
    castURL: "https://api.themoviedb.org/3/",
    page:[],
    baseURL: null,
    actorData: null,
    moviesData: null,
    movieData: null,
    castData: null,
    searchType: null,
    serachActorNum: null,
    clickActorArray: null,
    clickMovieArray: null,
    clickMovieID: null,
    Moviemedia: null,
    castURL2: null,
    init: () => {
        app.pages = document.querySelectorAll(".page");
        app.addListeners();
        //get the base url to use in the app
        app.baseURL = location.href.split("#")[0];  
        history.replaceState({}, app.active, `${app.baseURL}#${app.active}`);
        app.transPage(app.active);
        //handle the back button
        window.addEventListener("popstate", app.poppy);
        //use it will stay in the page and back to last order
    },
    addListeners: function(){
        document.getElementById("search").addEventListener("click", app.toGoActors);
        document.getElementById("home").addEventListener("keypress", app.pressEnter);
        let fab = document.querySelectorAll(".fab");
        for(let i=0;i<fab.length;i++){
            fab[i].addEventListener("click", app.toGoHome);
        }
    },
    toGoHome: ev => {
        let searchInput = document.querySelector('input');
        searchInput.value ="";
        let link = ev.target;
        let target = link.getAttribute("data-href");
        history.pushState({}, target, `${app.baseURL}#${target}`);
        app.transPage(target); 
    },
    toGoActors: (ev) =>{
        app.searchType = document.getElementById('input').value;
        if(app.searchType == ''){
            alert("Type a Actor's Name!")
        }else{
        ev.preventDefault();
        ev.stopPropagation();
        let link = ev.target;
        let target = link.getAttribute("data-href");
        if (target == null) {
            target = 'actors';
        }
        history.pushState({}, target, `${app.baseURL}#${target}`);
        app.transPage(target);
        app.getActorData()
        .then(() => {
            app.getActorsPage(app.actorData);
            });
        }
        },
    nav: ev => {
        ev.preventDefault();
        ev.stopPropagation();
        let link = ev.target;
        let target = link.getAttribute("data-href");
        history.pushState({}, target, `${app.baseURL}#${target}`);
        app.transPage(target);
    },
    transPage: target => {
        document.querySelector(".active").classList.remove("active");
        document.querySelector(`#${target}`).classList.add("active");
        window.scrollTo(0,0);
    },
    pressEnter: (en) =>{
            if (en.key === 'Enter') {
                en.target.attributes['data-href'] = 'actors'
                app.toGoActors(en);
            }
        },
    poppy: ev => {
        //get the id
        let target = location.hash.replace("#", "");
        app.transPage(target);
    },
    getActorData: () => {
            app.url = app.apiURL + 'api_key=' + app.API_KEY + '&language=en-US&query=' + app.searchType + '&page=1&include_adult=true`';
            return fetch(app.url)
            .then(response => response.json())
            .then(data => { 
                app.actorData = data; //save the data in a global location inside APP
            })
            .catch(app.badThings);
    },
    badThings: (err)=>{
        alert(err.message);
    },
    getActorsPage: data => {
        let actors = document.getElementById('actorsNum');
        app.serachActorNum = data.results.length;
        actors.innerHTML = "";
        let p = document.createElement('p');
        if(data.total_results >= 10000){
            p.textContent = "*"+app.searchType+ "*" + " has " + ' ' + data.total_results + "+ results. ";
            actors.appendChild(p);
        }else{
            p.textContent = "*"+app.searchType+ "*" + " has " + ' ' + data.total_results + "  results. " ;
            actors.appendChild(p);
        }
        let div = document.createElement('div');
        let actorsList = document.getElementById('actorsList');
        actorsList.innerHTML = "";
        //create a Div in 'actorsList' called '.actorsCard'
        div.setAttribute('id', 'actorsCards');     
        actorsList.appendChild(div); 
        for(let i =0;i < data.results.length;i++){           
            let actorsCards = document.getElementById("actorsCards");
            let div4 = document.createElement('div');
            //create a Div in 'actorsList' called '.actorsCard'
            div4.setAttribute('class', 'actors-Card');     
            actorsCards.appendChild(div4); 
            //create a Div is called '.actorsPortrait' in 'actorsCard' 
            let div2 = document.createElement('div');
            let actorsCard = document.querySelectorAll('.actors-Card')[i];
            div2.setAttribute('class','actorsPortrait');
            actorsCard.appendChild(div2);      
            //add img tag in '.actorsPotrait' div
            if(data.results[i].profile_path == null){
                let actorsPortrait = document.querySelectorAll('.actorsPortrait')[i];
                let img = document.createElement('img');
                img.src = "./img/actor-placeholder.png"; 
                img.alt = "Actors Portrait";
                actorsPortrait.appendChild(img);
                let div3 = document.createElement('div');
                div3.setAttribute('class','actorsInfo');
                actorsCard .appendChild(div3);
            } 
            else{
                let actorsPortrait = document.querySelectorAll('.actorsPortrait')[i];
                let img = document.createElement('img');
                img.src = app.imgURL + '/' + imgSizes.profile_sizes[2] + data.results[i].profile_path; 
                img.alt = "Actors Portrait";
                actorsPortrait.appendChild(img);
                let div3 = document.createElement('div');
                div3.setAttribute('class','actorsInfo');
                actorsCard .appendChild(div3);
            }
            //add actor infomation in 'actorsInfo'
            let actorsInfo = document.querySelectorAll('.actorsInfo')[i];
            let h3 = document.createElement('h3');
            h3.textContent = data.results[i].name; 
            h3.setAttribute('data-href', 'movies'); 
            h3.setAttribute('class', "actors-nameButton"); 
            actorsInfo.appendChild(h3);
            document.querySelectorAll("h3")[i].addEventListener("click", (ev)=>{
                app.clickActorArray = app.actorData.results[i];
                document.getElementById('actorName').textContent = app.clickActorArray.name;
                app.nav(ev);
                app.getMoviesPage(ev);
            });

            
            let actorsInfo4 = document.querySelectorAll('.actorsInfo')[i];
            let p3 = document.createElement('p');
            p3.innerHTML = "<b>id: </b>" + data.results[i].id;
            actorsInfo4.appendChild(p3);
            
            let actorsInfo2 = document.querySelectorAll('.actorsInfo')[i];
            let p = document.createElement('p');
            p.innerHTML = "<b>position: </b>" + data.results[i].known_for_department;
            actorsInfo2.appendChild(p);
            
            let actorsInfo3 = document.querySelectorAll('.actorsInfo')[i];
            let p2 = document.createElement('p');
            p2.innerHTML = "<b>popularity: </b>" + data.results[i].popularity;
            actorsInfo3.appendChild(p2);
        }   
    },
    getMoviesPage: data => {
        // clickActorArray
        let moviesList = document.getElementById("moviesList");
        moviesList.innerHTML = "";
        let div = document.createElement('div');
        //create a Div in 'actorsList' called '.actorsCard'
        div.setAttribute('id', 'divForDelete'); 
        
        moviesList.appendChild(div); 
        for(let i =0;i < app.clickActorArray.known_for.length;i++){
            if(app.clickActorArray.known_for[i].media_type == "movie"){
                let divForDelete = document.getElementById("divForDelete");
                let div5 = document.createElement('div');
                div5.setAttribute('class', 'movies-Card');     
                divForDelete.appendChild(div5);
                
                let moviesCard = document.querySelectorAll('.movies-Card')[i];
                let img2 = document.createElement('img');
                img2.src = app.imgURL + '/' + imgSizes.poster_sizes[2] + app.clickActorArray.known_for[i].poster_path; 
                img2.alt = "Movies Poster";
                moviesCard.appendChild(img2);
                
                let div6 = document.createElement('div');
                div6.setAttribute('class', 'moviesInfo'); 
                moviesCard.appendChild(div6);
                
                let moviesInfo = document.querySelectorAll(".moviesInfo")[i];
                let h3 = document.createElement('h3');
                h3.setAttribute('data-href', 'movie');
                h3.setAttribute('class', 'moviesName');
                h3.textContent = app.clickActorArray.known_for[i].original_title;
                moviesInfo.appendChild(h3);
                
                let p3 = document.createElement('p');            
                p3.innerHTML = "<b>TYPE: </b>" + app.clickActorArray.known_for[i].media_type;
                moviesInfo.appendChild(p3);
                let p2 = document.createElement('p');
                p2.innerHTML = "<b>RELEASE DATE: </b>" + app.clickActorArray.known_for[i].release_date;
                moviesInfo.appendChild(p2);
                let p4 = document.createElement('p');
                p4.innerHTML = "<b>VOTE AVERAGE: </b>" + app.clickActorArray.known_for[i].vote_average;
                moviesInfo.appendChild(p4);

                document.querySelectorAll(".moviesName")[i].addEventListener("click", (ev)=>{
                    app.clickMovieArray = app.clickActorArray.known_for[i];
                    document.getElementById('movieName').textContent = app.clickActorArray.known_for[i].original_title;
                    app.nav(ev);
                    app.clickMovieID = app.clickActorArray.known_for[i].id;
                    app.Moviemedia = app.clickActorArray.known_for[i].media_type;
                    app.getCastData().then(() => {
                        app.getMoviePage(ev);
                    });
                });
            } else {
                let divForDelete = document.getElementById("divForDelete");
                let div7 = document.createElement('div');
                div7.setAttribute('class', 'movies-Card');     
                divForDelete.appendChild(div7);
                
                let moviesCard = document.querySelectorAll('.movies-Card')[i];
                let img2 = document.createElement('img');
                img2.src = app.imgURL + '/' + imgSizes.poster_sizes[2] + app.clickActorArray.known_for[i].poster_path; 
                img2.alt = "Movies Poster";
                moviesCard.appendChild(img2);
                
                let div6 = document.createElement('div');
                div6.setAttribute('class', 'moviesInfo');    
                moviesCard.appendChild(div6);
                
                let moviesInfo = document.querySelectorAll(".moviesInfo")[i];
                let h3 = document.createElement('h3');
                h3.setAttribute('data-href', 'movie');
                h3.setAttribute('class', 'moviesName');
                h3.textContent = app.clickActorArray.known_for[i].original_name;
                moviesInfo.appendChild(h3);
                
                let p3 = document.createElement('p');            
                p3.innerHTML = "<b>TYPE </b>" +app.clickActorArray.known_for[i].media_type;
                moviesInfo.appendChild(p3);
                let p2 = document.createElement('p');
                p2.innerHTML = "<b>FIRST DATE: </b>" + app.clickActorArray.known_for[i].first_air_date;
                moviesInfo.appendChild(p2);
                let p4 = document.createElement('p');
                p4.innerHTML = "<b>VOTE AVERAGE: </b>"+app.clickActorArray.known_for[i].vote_average;
                moviesInfo.appendChild(p4);
                
                document.querySelectorAll(".moviesName")[i].addEventListener("click", (ev)=>{
                    app.clickMovieArray = app.clickActorArray.known_for[i];
                    document.getElementById('movieName').textContent = app.clickActorArray.known_for[i].original_name;
                    app.nav(ev);
                    app.clickMovieID = app.clickActorArray.known_for[i].id;
                    app.Moviemedia = app.clickActorArray.known_for[i].media_type;
                    app.getCastData(ev)
                        .then((ev) => {  
                            app.getMoviePage(ev);
                        });
                });
            }
        }
    },
    getMoviePage: (ev) => {
        let moviepage = document.getElementById("moviepage");
        moviepage.innerHTML = "";
        let div9 = document.createElement('div');
        div9.setAttribute('id', 'divForDelete2'); 
        moviepage.appendChild(div9);

        let divForDelete2 = document.getElementById("divForDelete2");
        
        let img3 = document.createElement('img');
        img3.src = app.imgURL + '/' + imgSizes.poster_sizes[4] + app.clickMovieArray.poster_path; 
        img3.alt = "Movie Poster";
        img3.setAttribute('class', 'posterSize'); 
        img3.setAttribute("id", "moviepost");
        divForDelete2.appendChild(img3);

        let div10 = document.createElement('div');  
        div10.setAttribute('class', 'details'); 
        divForDelete2.appendChild(div10);

        let details = document.querySelector(".details");

        if(app.clickMovieArray.media_type == "movie"){
            let p3 = document.createElement('p');            
            p3.innerHTML = "<b>TYPE: </b>" + app.clickMovieArray.media_type;
            details.appendChild(p3);
            let p2 = document.createElement('p');
            p2.innerHTML = "<b>RELESE DATE: </b>" + app.clickMovieArray.release_date;
            details.appendChild(p2);
            let p4 = document.createElement('p');
            p4.innerHTML = "<b>VOTE AVERAGE: </b>" + app.clickMovieArray.vote_average;
            details.appendChild(p4);
            let p5 = document.createElement('p');
            p5.innerHTML = "<b>OVERVIEW: </b>"+ app.clickMovieArray.overview;
            details.appendChild(p5);
        }else{
            let p3 = document.createElement('p');            
            p3.innerHTML = "<b>TYPE: </b>" + app.clickMovieArray.media_type;
            details.appendChild(p3);
            let p2 = document.createElement('p');
            p2.innerHTML = "<b>FIRST DATE: </b>" + app.clickMovieArray.first_air_date;
            details.appendChild(p2);
            let p4 = document.createElement('p');
            p4.innerHTML = "<b>VOTE AVERAGE: </b>"+app.clickMovieArray.vote_average;
            details.appendChild(p4);
            let p5 = document.createElement('p');
            p5.innerHTML = "<b>OVERVIEW: </b>"+app.clickMovieArray.overview;
            details.appendChild(p5);
        }

        
        for(i=0;i<app.castData.cast.length;i++){
            let div11 = document.createElement('div');
            div11.setAttribute('class', "castCard");
            details.appendChild(div11);
            let castCard = document.querySelectorAll(".castCard")[i];
            if(app.castData.cast[i].profile_path == null){
                let img4 = document.createElement("img");
                img4.src = "./img/actor-placeholder.png"; 
                img4.alt = "Cast Portrait";
                castCard.appendChild(img4);
            }else{
            let actorsPortrait2 = document.querySelectorAll(".actorsPortrait2")[i];
            let img4 = document.createElement("img");
            img4.src = app.imgURL + '/' + imgSizes.profile_sizes[2] + app.castData.cast[i].profile_path; 
            img4.alt = "Cast Portrait";
            castCard.appendChild(img4);
            }
            let div12 = document.createElement('div');
            div12.setAttribute('class', "castInfo");
            castCard.appendChild(div12);
            let castInfo = document.querySelectorAll(".castInfo")[i];
            let p6 = document.createElement('p');
            p6.innerHTML = "<b>CHARACTER: </b>" + app.castData.cast[i].character;
            castInfo.appendChild(p6);
            let p7 = document.createElement('p');
            p7.innerHTML = "<b>NAME: </b>" + app.castData.cast[i].name;
            castInfo.appendChild(p7);
        }
    },
    getCastData (){
        app.castURL2 = app.castURL + app.Moviemedia + "/" + app.clickMovieID + "/credits?api_key=" + app.API_KEY + "&language=en-US";
        return fetch(app.castURL2)
        .then(response => response.json())
        .then(data => { 
            app.castData = data; //save the data in a global location inside APP
        })
        .catch(app.badThings);

    }
}
document.addEventListener(ready, app.init);