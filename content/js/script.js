var shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
(function ($) {
    $.get("https://api.myjson.com/bins/6iv3y")
        .done(function (data) {
            console.log(data);
            createListView(data);
        });
})(jQuery);

function createListView(results) {
    let output = '';
    $.each(results, (index, result) => {
        if (result && result.images.length > 0 && result.dates.length > 0) {
            let primaryImg = result.images.filter((img) => {
                if (typeof (img.is_primary) !== 'undefined' && img.is_primary && typeof (img.url) !== 'undefined' && img.url !== "")
                    return img;
            });
            if (primaryImg.length > 0) {
                let stars = ``;

                if (typeof(result.rating) !== 'undefined'){
                    let i = 0;
                    while (i < result.rating) {
                        stars += `<i class="fas fa-star"></i>`;
                        i++;
                    }
                    if (result.rating !== parseInt(result.rating, 10)){
                        stars += `<i class="fas fa-star-half-alt"></i>`;
                    }
                } 

                output += `<li class="travelWrapper row">
                <div class="imageWrapper col-3 p-0">
                    <img src="${primaryImg[0].url}" class="primaryImg" alt="${result.name}" />
                </div>
                <div class="travelDetails col-9">
                ${typeof(result.dates[0].discount) !== "undefined" ? `<div class="triangle"><span>${result.dates[0].discount}</span></div>`: null}
                    <div class="row">
                        <div class="col-8">
                            <h1 class="travelTitle">${result.name}</h1>
                            <div class="starsAndReviews">
                                <div class="stars">${stars}</div>
                                <div class="reviews">${result.reviews} reviews</div>
                            </div>
                            <div class="description">
                               <p>"${result.description}"</p>
                            </div>
                            <div class="destinationsAndOperator">
                                <div class="doTitles">
                                    <p>Destinations</p>
                                    <p>Starts / ends in</p>
                                    <p>operator</p>
                                </div>
                                <div class="doValues">
                                <p>${result.cities.length} destinations</p>
                                <p>start / end ?</p>
                                <p>${result.operator_name}</p>
                            </div>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="fromDate">
                                <p class="from">From</p>
                                <p class="price">&euro; ${new Intl.NumberFormat('en-US').format(result.dates[0].eur)}</p>
                            </div>
                            <div class="days">
                                <p> ${result.length} days</p>
                            </div>
                            <div class="datesAndSpaces">
                                <div class="dates">
                                    <p> ${result.dates[0].start ? dateConvert(result.dates[0].start) : ""}</p>
                                    <p> ${result.dates[1].start ? dateConvert(result.dates[1].start) : ""}</p>
                                </div>
                                <div class="spaces">
                                    <p> ${result.dates[0].availability ? result.dates[0].availability + " spaces left" : ""}</p>
                                    <p> ${result.dates[1].availability ? result.dates[0].availability + " spaces left" : ""}</p>
                                </div>
                            </div>
                            <button class="viewMore">View More</button>
                        </div>
                    </div>
                    
                </div>
            </div>`;
            }
        }
    });

    $("#travelsResults").append(output);
}

function dateConvert(date){
    var dateObj = new Date(date);
    var month = dateObj.getUTCMonth();
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    newdate = day + " " + shortMonths[month] + " " + year;
    return newdate;
}