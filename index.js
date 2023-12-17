const baseURL = "http://127.0.0.1:8000";

const addDataList = async()=>{
    const moviesList = document.getElementById("movies-list");
    const response = await fetch(`${baseURL}/api/autocomplete`);
    const data = await response.json()
    data['data'].forEach(element => {
        const optionTag = document.createElement("option");
        optionTag.value= element;
        moviesList.append(optionTag);   
    });
}

const clearDiv = (name)=>{
    const div = document.getElementById(name);
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}
const createCard= (title,posterPath)=>{
   const card = document.createElement("div");
   card.className = "card";
   const img = document.createElement('img');
   img.src = posterPath;
   img.alt ="Poster";
   img.style = "width:100%";
   const innerDiv = document.createElement("div");
   innerDiv.className = "container2";
   innerDiv.innerHTML = title;
   card.append(img,innerDiv);
   return card;
}

const createSearchResultCard = (data)=>{
    const div = document.createElement("div");
    div.className = "searchImage column";
    const img = document.createElement('img');
    img.src = data['poster_path'];
    img.alt ="Poster";
    img.style = "width:50%";
    div.append(img);
    const otherDiv = document.createElement("div");
    otherDiv.className="description column";
    otherDiv.innerHTML =`<h3 style="margin-bottom: 5px;">${data['title']}</h3><br/>
    TITLE: ${data['title']}<br/>
    OVERVIEW: ${data['overview']}<br/>
    RATING: ${data['rating']}/10(${data['vote_count']})<br/>
    GENRE: ${String(data['genres'])}<br/>
    RELEASE DATA: ${data['release_date']}<br/>
    RUNTIME: ${data['runtime']}<br/>
    STATUS: ${data['status']}<br/>
    `
    return [div,otherDiv]
}
const createModal= data => {
    clearDiv('modalContainer')
    console.log(data);
    var modal = document.createElement('div');
    modal.id = 'myModal';
    modal.className = 'modal';
    var modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    var closeButton = document.createElement('span');
    closeButton.className = 'close';
    closeButton.innerHTML = '&times;';

    var modalInnerDiv = document.createElement('div');
    modalInnerDiv.id = "modal-inner-div";

    var modalImageDiv = document.createElement('div');
    modalImageDiv.id="modal-image-div";

    var image = document.createElement('img');
    image.src = data['profile_path'];
    image.height = "450";

    modalImageDiv.appendChild(image);

    var modalInfoDiv = document.createElement('div');
    modalInfoDiv.id = "modal-info-div";

    var deathday = data['deathday']?`<p>Deathday: ${data['deathday']}</p><br/>`:""

    modalInfoDiv.innerHTML =`
        <p>Name: ${data['name']}</p>
        <br/>
        <p>Birthday: ${data['birthday']}</p>
        <br/>
        ${deathday?deathday:""}
        <p>Place of Birth: ${data['place_of_birth']}</p>
        <br/>
        <p>Biography: ${data['biography']}</p>
        <br/>
    `;
    modalInnerDiv.appendChild(modalImageDiv);
    modalInnerDiv.appendChild(modalInfoDiv);
    
    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalInnerDiv);
    modal.appendChild(modalContent);
    document.getElementById('modalContainer').appendChild(modal);

     modal.style.display = 'block';
  

    closeButton.addEventListener('click', function() {
      modal.style.display = 'none';
    });
  }
const movieSearchForm = ()=>{
    const movieSearch = document.getElementById("movie-search");
    movieSearch.onsubmit = async (e)=>{
        e.preventDefault();
        const movie = document.getElementById("search").value;
        document.getElementById("loader").style.display = "block";
        //Get Recommendation for given movie
        const response = await fetch(`${baseURL}/api/movie/similar/${movie}`);
        const data = await response.json()
        
        if(response.status===400)
        {
            document.getElementById("loader").style.display = "none";
            window.alert(data['message'])
        }
        else{
            clearDiv("searchResult");
            clearDiv("cast");
            clearDiv("recommend");
            

            const res = await fetch(`${baseURL}/api/movie/details/${movie}`);
            const output = (await res.json())['data'];
            document.getElementById("loader").style.display = "none";
            const searchResult = document.getElementById("searchResult");
            const [div1,div2] = createSearchResultCard(output);
            searchResult.append(div1,div2)

            const castCard = document.getElementById("cast");
            const castHeading = document.getElementById("castHeading");
            castHeading.style.display = "block";

            output['casts'].forEach(cast=>{
                const card = createCard(`<h4><b>${cast['name']}</b></h4>\n<p>Character: ${cast['character']}</p>`,cast['profile']);
                card.id= cast['id'];
                castCard.append(card);
                castCard.onclick = async (e)=>{
                   // console.log(e.target.parentNode.id)
                    const res = await fetch(`${baseURL}/api/cast/details/${e.target.parentNode.id}`);
                    const output = (await res.json())['data'];
                    createModal(output)
                }
            })

            const recommendCard = document.getElementById("recommend");
            const recommendedHeading = document.getElementById("recommendedHeading");
            recommendedHeading.style.display = "block";
            data['data'].forEach(async element =>{
                const res = await fetch(`${baseURL}/api/movie/details/${element}`);
                const output = (await res.json())['data'];
                const card = createCard(`<h4><b>${output['title']}</b></h4>`,output['poster_path'])
                recommendCard.append(card);
            })
        }
    }
}

document.addEventListener("DOMContentLoaded",()=>{
    addDataList();
    movieSearchForm()
})