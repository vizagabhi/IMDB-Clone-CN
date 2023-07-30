
const key = 'bc06aaeb';
fetch('http://www.omdbapi.com/?i=tt3896198&apikey=bc06aaeb')
    .then(res => res.json())
    .then(data => console.log(data));

var searchInput = document.getElementById('Input');
searchInput.addEventListener('input', searchMovies);

//When the user is searching for the movie then a list of the related movie will be displayed and that list is fetched
async function searchMovies() {
    const url = `https://www.omdbapi.com/?s=${(searchInput.value).trim()}&page=1&apikey=${key}`
    const res = await fetch(`${url}`);
    const data = await res.json();

    if (data.Search) {
        //Calling the function to display list of the movies related to the user search
        displayMovieList(data.Search)
    }
}

//Displaying the list of movies on the search page according to the user input value
async function displayMovieList(movies) {
    var output = '';
    //Traversing over the movies list which is passed as an argument to our function
    for (i of movies) {

        var img = '';
        if (i.Poster != 'N/A') {
            img = i.Poster;
        }
        else {
            img = 'images/notfound.png';
        }
        var id = i.imdbID;

        //Appending the output through string interpolition
        output += `

        <div class="fav-item">
            <div class="fav-poster">
            <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
            </div>
            <div class="fav-details">
                <div class="fav-details-box">
                    <div>
                        <p class="fav-movie-name"><a href="movie.html?id=${id}">${i.Title}</a></p>
                        <p class="fav-movie-rating"><a href="movie.html?id=${id}">${i.Year}</a></p>
                    </div>
                    <div style="color: red">
                        <i class="fa-solid fa-heart" style="cursor:pointer;" onClick=addToFav('${id}')></i>
                    </div>
                </div>
            </div>
        </div>

       `
    }
    //Appending this to the movie-display class of our html page
    document.querySelector('.fav-container').innerHTML = output;
    
}


async function oneMovie() {
    // Finding ID of the movie from the URL
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id')
    console.log(id);
    const url = `https://www.omdbapi.com/?i=${id}&apikey=${key}`
    const res = await fetch(`${url}`);
    const data = await res.json();

    // Dynamic Output Html 
    var output = `

    <div class="movie-poster">
        <img src=${data.Poster} alt="Film Poster">
    </div>
    <div class="movie-details">
        <div class="details-header">
            <div class="dh-ls">
                <h2>${data.Title}</h2>
            </div>
            <div style="color: red" class="dh-rs">
                <i class="fa-solid fa-heart" onClick=addToFav('${id}') style="cursor: pointer;"></i>
            </div>
        </div>
        <span class="italics-text"><i>${data.Year} &#x2022; ${data.Country} &#x2022; Rating - <span
                    style="font-size: 18px; font-weight: 600;">${data.imdbRating}</span>/10 </i></span>
        <ul class="details-ul">
            <li><strong>Actors: </strong>${data.Actors}</li>
            <li><strong>Director: </strong>${data.Director}</li>
            <li><strong>Writers: </strong>${data.Writer}</li>
        </ul>
        <ul class="details-ul">
            <li><strong>Genre: </strong>${data.Genre}</li>
            <li><strong>Release Date: </strong>${data.DVD}</li>
            <li><strong>Box Office: </strong>${data.BoxOffice}</li>
            <li><strong>Movie Runtime: </strong>${data.Runtime}</li>
        </ul>
        <p style="font-size: 14px; margin-top:10px;">${data.Plot}</p>
        <p style="font-size: 15px; font-style: italic; color: #222; margin-top: 10px;">
            <i class="fa-solid fa-award"></i>
            &thinsp; ${data.Awards}
        </p>
    </div> 
    `
    // Appending the output
    document.querySelector('.movie-container').innerHTML = output

}

//Favorites movies are loaded on to the favourite page from localstorage
async function favLoad() {

    var output = ''
    //Traversing over all the movies in the localstorage
    for (i in localStorage) {
        var id = localStorage.getItem(i);
        console.log(`Id: ${id}`)
        if (id != null) {
            //Fetching the movie through id 
            const url = `https://www.omdbapi.com/?i=${id}&plot=full&apikey=${key}`
            const res = await fetch(`${url}`);
            const data = await res.json();
            console.log(data);


            var img = ''
            if (data.Poster) {
                img = data.Poster
            }
            else { img = data.Title }
            var Id = data.imdbID;
            output += `

        <div class="fav-item">
            <div class="fav-poster">
                <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
            </div>
            <div class="fav-details">
                <div class="fav-details-box">
                    <div>
                        <p class="fav-movie-name">${data.Title}</p>
                        <p class="fav-movie-rating">${data.Year} &middot; <span
                                style="font-size: 15px; font-weight: 600;">${data.imdbRating}</span>/10</p>
                    </div>
                    <div style="color: maroon">
                        <i class="fa-solid fa-trash" style="cursor:pointer;" onClick=removeFromFav('${Id}')></i>
                    </div>
                </div>
            </div>
        </div>

       `;
        }

    }
    //Appending the html to the movie-display class in favorites page 
    document.querySelector('.fav-container').innerHTML = output;
}

async function addToFav(id) {
    
    localStorage.setItem(Math.random().toString(36).slice(2, 7), id);
    alert('Movie Added to Favourite!');
}

//Removing the movie from the favorites list  and also from the localstorage
async function removeFromFav(id) {
    console.log(id);
    for (i in localStorage) {
        // If the ID passed as argument matches with value associated with key, then removing it 
        if (localStorage[i] == id) {
            localStorage.removeItem(i)
            break;
        }
    }
    //Alerting the user and refreshing the page
    alert('Movie Removed from Watchlist');
    window.location.replace('favourite.html');
}




