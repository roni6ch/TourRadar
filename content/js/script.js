const shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fullMonthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
let travelResults = [];
let filteredList = [];
let sortedList = [];
let filteredDate = "";
(function ($) {
    spinner(true);
    $.get("https://api.myjson.com/bins/6iv3y")
        .done((data) => {
            $(".spinner").hide();
            console.log(data);
            travelResults = data;
            createListView(data);
            createMonthsFilter();
        });
})(jQuery);

$(".sortBy").change(() => {
    sortList();
});

$(".filterBy").change(() => {
    spinner(true);
    if ($(".filterBy :selected").val() == "resetFilter"){
        filteredList = [];
    }
    else{
        filteredDate = getNumberedDate($(".filterBy :selected").val());
        filteredList = JSON.parse(JSON.stringify(travelResults));
        for (let result of filteredList) {
            _.remove(result.dates, function (d) {
                return !d.start.includes(filteredDate);
            });
        }
    }
    sortList();
});

function spinner(bool){
    if (bool){
        $(".spinner").show();
    }else{
        $(".spinner").hide();
    }
}
function sortList(){
    spinner(true);
    let list = filteredList.length > 0 ? filteredList : travelResults;
    switch ($(".sortBy :selected").val()) {
        case "popularity":
            sortedList = list;
            break;
        case "low_price":
            sortedList = _.orderBy(list, [(r) => { if (r.dates.length > 0) return r.dates[0].eur; return 0 }], ['asc']);
            break;
        case "high_price":
            sortedList = _.orderBy(list, [(r) => { if (r.dates.length > 0) return r.dates[0].eur; return 0 }], ['desc']);
            break;
        case "long_tour":
            sortedList = _.orderBy(list, [(r) => { return r.length; }], ['desc']);
            break;
        case "short_tour":
            sortedList = _.orderBy(list, [(r) => { return r.length; }], ['asc']);
            break;
        default:
            sortedList = list;
            break;
    }
    createListView(sortedList);
    spinner(false);
}
function createListView(results) {
    let output = '';
    $("#travelsResults").html('');
    $.each(results, (index, result) => {
        if (result && typeof (result.dates) !== "undefined" && typeof (result.images) !== "undefined" && result.images.length > 0 && result.dates.length > 0) {

            let primaryImg = result.images.filter((img) => {
                if (typeof (img.is_primary) !== 'undefined' && img.is_primary && typeof (img.url) !== 'undefined' && img.url !== "")
                    return img;
            });
            if (primaryImg.length == 0 && typeof (result.images[0].url) !== 'undefined' && result.images[0].url !== "") {
                primaryImg = result.images;
            }
            if (primaryImg.length > 0) {
                let stars = getRatingStars(result.rating);
                output += `<li class="travelWrapper row animated fadeIn">
                <div class="imageWrapper col-md-3 p-0">
                    <img src="${primaryImg[0].url}" class="primaryImg" alt="${result.name}" />
                    <img src="./content/images/heart.png" class="heart" alt="favorite" />
                </div>
                <div class="travelDetails col-md-9 pb-2">
                ${typeof (result.dates[0].discount) !== "undefined" ? `<div class="triangle"><span>-${result.dates[0].discount}</span></div>` : ""}
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
                                <p>${result.cities[0].name} / ${result.cities[result.cities.length - 1].name}</p>
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
                                    <p> ${result.dates.length > 0 && result.dates[0].start ? dateConvert(result.dates[0].start) : ""}</p>
                                    <p> ${result.dates.length > 1 && result.dates[1].start ? dateConvert(result.dates[1].start) : ""}</p>
                                </div>
                                <div class="spaces">
                                    <p> ${result.dates.length > 0 && result.dates[0].availability ? result.dates[0].availability + " spaces left" : ""}</p>
                                    <p> ${result.dates.length > 1 && result.dates[1].availability ? result.dates[0].availability + " spaces left" : ""}</p>
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

function createMonthsFilter() {
    let output = '';
    let filteredMonths = _.uniq(_.flatten(_.map(travelResults, (result) => {
        return _.uniq(_.map(result.dates, (r) => {
            return fullMonthName(r.start);
        }))
    })));
    filteredMonths = _.sortBy(filteredMonths, function(date) {return new Date(date);});
    //insert filtered list select option
    filteredMonths.forEach((date) => {
        output += `<option value="${date}">${date}</option>`;
    });
    $(".filterBy").append(output);
}
function getNumberedDate(date) {
    var dateObj = new Date(date);
    var month = dateObj.getMonth();
    var year = dateObj.getFullYear();
    newdate = year + "-" + ("0" + (month + 1)).slice(-2);
    return newdate;
}
function fullMonthName(date) {
    var dateObj = new Date(date);
    var month = dateObj.getMonth();
    var year = dateObj.getFullYear();

    newdate = fullMonthNames[month] + " " + year;
    return newdate;
}
function dateConvert(date) {
    var dateObj = new Date(date);
    var month = dateObj.getMonth();
    var day = dateObj.getDate();
    var year = dateObj.getFullYear();

    newdate = day + " " + shortMonthNames[month] + " " + year;
    return newdate;
}

function getRatingStars(rating) {
    let stars = '';
    if (typeof (rating) !== 'undefined') {
        let i = 0;
        while (i < parseInt(rating, 10)) {
            stars += `<i class="fas fa-star"></i>`;
            i++;
        }
        if (rating !== parseInt(rating, 10)) {
            stars += `<i class="fas fa-star-half-alt"></i>`;
        }
        return stars;
    }
}