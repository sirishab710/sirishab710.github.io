//this takes the inputted search value and runs displayMovies() to gather all movies with the specified keyword
$(document).ready(() => {
    $("#search-form").on("submit", (e) => {
        let searchValue = ($('#search-value').val());
        displayMovies(searchValue);
        e.preventDefault();
    })
});
//this function will display all possible movies
function displayMovies(searchValue) {
    let page = 1;
    let output = "";
    let movies = "";
    //the while loop allows for pagination; since the API only returns 10 results at a time, this loop increments the page number to get all results
    while(page <= 100) {
        axios.get("https://www.omdbapi.com/?i=tt3896198&apikey=14e454be&s="+searchValue+"&type=movie"+"&page="+page)
        .then((response) => {
            console.log(response);
            movies = response.data.Search;
            $.each(movies, (index, movie) => {
                //information about each movie is added here in HTML to display on the page
                output += `
                <div class="col-md-4">
                    <div class="well text-center">
                        <br>
                        <img src="${movie.Poster}">
                        <h6>${movie.Title}</h6>
                        <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Learn More</a>
                    </div>    
                </div>
                `;
            });
            $('#movies').html(output);
        })
        .catch((err) => {
            console.log(err);
        }); 
        page = page + 1;
        output = "";
    }
}
//this keeps track of the movie chosen by the user after searching
function movieSelected(id) {
    sessionStorage.setItem("movieId", id);
    window.location = "movie.html";
    return false;
}
//this function displays wanted information about the chosen movie and gives the option to search again or go directly to IMDb
function movieInfo() {
    let movieId = sessionStorage.getItem("movieId");
    axios.get("https://www.omdbapi.com/?apikey=14e454be&i="+movieId)
        .then((response) => {
            console.log(response);
            let movie = response.data;
            let output = `
                <br>
                <br>
                <div class="row">
                    <div class="col-md-4">
                        <img src="${movie.Poster}" class="thumbnail">
                    </div>
                    <div class="col-md-8">
                        <h2>${movie.Title}</h2>
                        <ul class="list-group">
                            <li class="list-group-item"><strong>Release Date:</strong> ${movie.Released}</li>
                            <li class="list-group-item"><strong>Runtime:</strong> ${movie.Runtime}</li>
                            <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
                            <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
                            <li class="list-group-item"><strong>Cast:</strong> ${movie.Actors}</li>
                            <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
                            <li class="list-group-item"><strong>IMDb Rating:</strong> ${movie.imdbRating} out of 10</li>
                        </ul>
                        <br>
                        <div class="plot">
                            <h3>Plot</h3>
                            ${movie.Plot}
                        </div>
                        <hr>
                        <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View Movie on IMDb</a>
                        <a href="index.html" class="btn btn-primary">Search Again</a>
                    </div>
                </div>
            `;
            $('#movie').html(output);
        })
        .catch((err) => {
            console.log(err);
        }); 
}
