
const API_url_random = 'https://api.thecatapi.com/v1/images/search?limit=2&api_key=live_uJJ9uwObNAZZ3jGon5VmfLGMJzOt3IkiSOh6spBEIsvgM7j2etinFe0nW0kOZQNW';
const API_url_favorites = 'https://api.thecatapi.com/v1/favourites';
const API_url_favorites_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}?&api_key=live_uJJ9uwObNAZZ3jGon5VmfLGMJzOt3IkiSOh6spBEIsvgM7j2etinFe0nW0kOZQNW`;
const API_url_uploading = 'https://api.thecatapi.com/v1/images/upload';
const spanError = document.getElementById('error');

async function recargarRandom() {
    
    const response = await fetch(API_url_random);
    if(response.status !== 200){
        spanError.innerHTML='Hubo un error: ' + response.status;
    }else{
        const data = await response.json();
    
            console.log('cats random');
            
            console.log(data);
            
            const img1 = document.getElementById('img1');
            const img2 = document.getElementById('img2');
            const btn1 = document.getElementById('btn1');
            const btn2 = document.getElementById('btn2');
            img1.src = data[0].url;
            img2.src =data[1].url;

            btn1.onclick = ()=>{saveFavouriteMichis(data[0].id)};
            btn2.onclick = ()=>{saveFavouriteMichis(data[1].id)};
    }
}

async function recargarFavorites() {

    const response = await fetch(API_url_favorites,{
        method : 'GET',
        headers : {
        'X-API-KEY' : 'live_uJJ9uwObNAZZ3jGon5VmfLGMJzOt3IkiSOh6spBEIsvgM7j2etinFe0nW0kOZQNW',
        },

    });
    const data = await response.json();
    console.log('cats favorites');
    console.log(data);
    if(response.status !== 200){
        spanError.innerHTML='Hubo un erro' + response.status + data.message;
    } else{
        const section = document.getElementById('favoritesMichis');
        section.innerHTML = "";
        const h2 = document.createElement('h2');
        const h2Text = document.createTextNode('michis favoritos')
        h2.appendChild(h2Text);
        section.appendChild(h2)

            data.forEach(michi =>{
                
                const article = document.createElement('article');
                const image = document.createElement('img');
                const btn = document.createElement('button');
                const btnText = document.createTextNode('Sacar')
            
                image.src= michi.image.url;
                image.width = 150;

                btn.appendChild(btnText);
                btn.onclick = () => DeleteFavouriteMichis(michi.id);
                article.appendChild(image);
                article.appendChild(btn);
                section.appendChild(article);
              
    });
    }
}

async function saveFavouriteMichis(id) {
    try {
        const res = await fetch(API_url_favorites, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY' : 'live_uJJ9uwObNAZZ3jGon5VmfLGMJzOt3IkiSOh6spBEIsvgM7j2etinFe0nW0kOZQNW'
            },
            body: JSON.stringify({
                image_id: id
            }),
        });

        if (res.status !== 200) {
            const data = await res.json();
            spanError.innerHTML = 'Hubo un error: ' + res.status + ' ' + data.message;
        } else {
            const data = await res.json();
            console.log('Save response:');
            console.log(data);
            recargarFavorites();
        }
    } catch (error) {
        spanError.innerHTML = 'Hubo un error: ' + error.message;
    }
}

async function DeleteFavouriteMichis(id) {
    try {
        const res = await fetch(API_url_favorites_DELETE(id), {
            method: 'DELETE',
            headers : {
                'X-API-KEY' : 'live_uJJ9uwObNAZZ3jGon5VmfLGMJzOt3IkiSOh6spBEIsvgM7j2etinFe0nW0kOZQNW',
                },
        });

        if (res.status !== 200) {
            const data = await res.json();
            spanError.innerHTML = 'Hubo un error: ' + res.status + ' ' + data.message;
        } else {
            const data = await res.json();
            console.log('michi eliminado ');
            console.log(data);
            recargarFavorites();
        }
    } catch (error) {
        spanError.innerHTML = 'Hubo un error: ' + error.message;
    }
}

async function uploadMichiFoto() {
    const form = document.getElementById('uploadingForm')
    const formData = new FormData(form)

    const res = await fetch(API_url_uploading,{
        method: 'POST',
        headers:{
            
            'X-API-KEY' : 'live_uJJ9uwObNAZZ3jGon5VmfLGMJzOt3IkiSOh6spBEIsvgM7j2etinFe0nW0kOZQNW'
        },
        body: formData,
    })
    const data = await res.json();

    if (res.status !== 201) {
        spanError.innerHTML = `Hubo un error al subir michi: ${res.status} ${data.message}`
    }
    else {
        console.log("Foto de michi cargada :)");
        saveFavouriteMichis(data.id)
    }
}

recargarRandom();
recargarFavorites();
