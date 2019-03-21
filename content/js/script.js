var shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let travelResults = "";
(function ($) {
    $(".spinner").show();
    $.get("https://api.myjson.com/bins/6iv3y")
        .done(function (data) {
            $(".spinner").hide();
            console.log(data);
            travelResults = data;
            createListView(data);
        });
})(jQuery);

$(".sortBy").change(() => {
    $(".spinner").show();
    switch ($(".sortBy :selected").val()) {
        case "low_price":
            $(".spinner").hide();
            Object.keys(travelResults).forEach((k) => {
                travelResults[k].dates.sort((a, b) =>{
                    return b.eur - a.eur;
                });
            });
            createListView(travelResults);
            break;
        case "high_price":
            $(".spinner").hide();

            Object.keys(travelResults).forEach((k) => {
                travelResults[k].dates.sort((a, b) =>{
                    return a.eur - b.eur;
                });
            });
            createListView(travelResults);
            break;
        case "long_tour":
        $(".spinner").hide();
            break;
        case "short_tour":
        $(".spinner").hide();
            break;
        default:
    }
});

function createListView(results) {
    let output = '';
    $("#travelsResults").html('');
    $.each(results, (index, result) => {
        if (result && result.images.length > 0 && result.dates.length > 0) {
            let primaryImg = result.images.filter((img) => {
                if (typeof (img.is_primary) !== 'undefined' && img.is_primary && typeof (img.url) !== 'undefined' && img.url !== "")
                    return img;
            });
            if (primaryImg.length > 0) {
                let stars = ``;

                if (typeof (result.rating) !== 'undefined') {
                    let i = 0;
                    while (i < result.rating) {
                        stars += `<i class="fas fa-star"></i>`;
                        i++;
                    }
                    if (result.rating !== parseInt(result.rating, 10)) {
                        stars += `<i class="fas fa-star-half-alt"></i>`;
                    }
                }

                output += `<li class="travelWrapper row animated fadeIn">
                <div class="imageWrapper col-md-3 p-0">
                    <img src="${primaryImg[0].url}" class="primaryImg" alt="${result.name}" />
                </div>
                <div class="travelDetails col-md-9 pb-2">
                ${typeof (result.dates[0].discount) !== "undefined" ? `<div class="triangle"><span>${result.dates[0].discount}</span></div>` : ""}
                    <div class="row">
                        <div class="col-md-8">
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
                        <div class="col-md-4 mt-2">
                            <div class="fromDate">
                                <p class="from">From</p>
                                <p class="price">&euro; ${new Intl.NumberFormat('en-US').format(result.dates[0].eur)}</p>
                            </div>
                            <div class="days">
                                <p> ${result.length} days</p>
                            </div>
                            <div class="mobileDays">
                            <p class="daysTitle">Days</p>
                            <p class="daysNumber">${result.length}</p>
                        </div>
                            <div class="datesAndSpaces mt-1">
                                <div class="dates">
                                    <p> ${result.dates[0].start ? dateConvert(result.dates[0].start) : ""}</p>
                                    <p> ${result.dates[1].start ? dateConvert(result.dates[1].start) : ""}</p>
                                </div>
                                <div class="spaces">
                                    <p> ${result.dates[0].availability ? result.dates[0].availability + " spaces left" : ""}</p>
                                    <p> ${result.dates[1].availability ? result.dates[0].availability + " spaces left" : ""}</p>
                                </div>
                            </div>
                            <button class="viewMore col-6 col-sm-6 col-md-12">View More</button>
                        </div>
                    </div>
                    
                </div>
            </div>`;
            }
        }
    });

    $("#travelsResults").append(output);
}

function dateConvert(date) {
    var dateObj = new Date(date);
    var month = dateObj.getUTCMonth();
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    newdate = day + " " + shortMonths[month] + " " + year;
    return newdate;
}