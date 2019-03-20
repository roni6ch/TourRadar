window.onload = function () {
    let fetch = new XMLHttpRequest();
    fetch.open('GET', 'https://api.myjson.com/bins/6iv3y', true);
    fetch.onload = function () {
        if (this.status == 200) {
            let results = JSON.parse(this.responseText);
            console.log(results);
            let output = '';
            results.forEach(result => {
                if (result.images.length > 0) {
                    let primaryImg = result.images.filter(function (img) {
                        if (typeof(img.is_primary) !== 'undefined' && img.is_primary && typeof(img.url) !== 'undefined' && img.url !== "")
                            return img;
                    });
                  if (primaryImg.length > 0){
                    output += `<div class="travelWrapper">
                        <div class="imageWrapper"><img src="${primaryImg[0].url}" class="primaryImg" /></div>
                        <div class="travelDetails">
                            <h1>${result.name}</h1>
                        </div>
                    </div>`; 
                }
            }
            });
           document.getElementById('travelsResults').innerHTML = output;

        }
    }
    fetch.send();
}