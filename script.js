// script.js - Tech News Pulse
// learning javascript is hard lol but im getting there

let myKey = "";
let currentCat = "technology";
let mySaved = [];
let darkOn = false;

window.onload = function () {

    // check if user already entered a key before
    let savedKey = localStorage.getItem("userApiKey");
    if (savedKey) {
        myKey = savedKey;
        document.getElementById("apibox").style.display = "none";
    }

    // check if dark mode was turned on before
    let savedTheme = localStorage.getItem("siteTheme");
    if (savedTheme == "dark") {
        darkOn = true;
        document.body.classList.add("dark");
        document.getElementById("darkbtn").textContent = "☀️ Light Mode";
    }

    // load saved articles from localstorage
    let storedSaved = localStorage.getItem("mySavedArticles");
    if (storedSaved) {
        mySaved = JSON.parse(storedSaved);
        updateSavedButton();
    }

    // event listener for dark mode button
    document.getElementById("darkbtn").addEventListener("click", switchTheme);

    // load the news
    if (myKey) {
        getNews();
    } else {
        loadSampleNews();
    }

}

// switch between dark and light mode
function switchTheme() {
    darkOn = !darkOn;
    if (darkOn) {
        document.body.classList.add("dark");
        document.getElementById("darkbtn").textContent = "☀️ Light Mode";
        localStorage.setItem("siteTheme", "dark");
    } else {
        document.body.classList.remove("dark");
        document.getElementById("darkbtn").textContent = "🌙 Dark Mode";
        localStorage.setItem("siteTheme", "light");
    }
}

// save the api key the user typed
function saveKey() {
    let typed = document.getElementById("keyinput").value.trim();
    if (typed == "") {
        alert("Please type your API key first!");
        return;
    }
    myKey = typed;
    localStorage.setItem("userApiKey", myKey);
    document.getElementById("apibox").style.display = "none";
    getNews();
}

// fetch real news from newsapi
function getNews() {
    showWaiting();

    let searchWord = document.getElementById("searchbox").value.trim();
    let url = makeUrl(searchWord);

    fetch(url)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {

            if (data.status == "error") {
                showOops();
                return;
            }

            // remove articles with no title or deleted ones
            let goodArticles = data.articles.filter(function (item) {
                return item.title && item.title !== "[Removed]";
            });

            if (goodArticles.length == 0) {
                showNothing();
                return;
            }

            hideAllMsgs();
            makeCards(goodArticles, "allcards");
        })
        .catch(function () {
            showOops();
        });
}

// build the api url depending on category and search
function makeUrl(searchWord) {
    let base = "https://newsapi.org/v2/";
    let end = "&language=en&pageSize=20&apiKey=" + myKey;

    if (searchWord) {
        return base + "everything?q=" + encodeURIComponent(searchWord) + "&sortBy=publishedAt" + end;
    }

    if (currentCat == "technology") {
        return base + "top-headlines?category=technology" + end;
    }

    let keywords = {
        ai: "artificial intelligence OR ChatGPT OR OpenAI",
        crypto: "bitcoin OR cryptocurrency OR ethereum",
        gadgets: "gadgets OR smartphone OR laptop",
        startups: "startup OR funding OR venture capital"
    };

    return base + "everything?q=" + encodeURIComponent(keywords[currentCat]) + "&sortBy=publishedAt" + end;
}

// when user clicks a category button
function changeCategory(cat, btn) {
    currentCat = cat;

    // remove active from all filter buttons
    let allBtns = document.getElementsByClassName("fbtn");
    for (let i = 0; i < allBtns.length; i++) {
        allBtns[i].classList.remove("active");
    }
    btn.classList.add("active");

    // go back to news view
    document.getElementById("newsarea").style.display = "block";
    document.getElementById("savedarea").style.display = "none";

    if (myKey) {
        getNews();
    } else {
        loadSampleNews();
    }
}

// when user clicks search
function doSearch() {
    if (!myKey) {
        // search inside the sample articles instead
        let word = document.getElementById("searchbox").value.trim().toLowerCase();
        if (!word) {
            loadSampleNews();
            return;
        }

        let found = sampleArticles.filter(function (item) {
            return item.title.toLowerCase().includes(word) ||
                (item.description && item.description.toLowerCase().includes(word));
        });

        hideAllMsgs();
        if (found.length == 0) {
            showNothing();
        } else {
            makeCards(found, "allcards");
        }
        return;
    }
    getNews();
}

// clear the search and reload
function clearSearch() {
    document.getElementById("searchbox").value = "";
    if (myKey) {
        getNews();
    } else {
        loadSampleNews();
    }
}

// build all the news cards
function makeCards(articles, whereToPut) {
    let box = document.getElementById(whereToPut);
    box.innerHTML = "";

    for (let i = 0; i < articles.length; i++) {
        let oneCard = buildOneCard(articles[i]);
        box.appendChild(oneCard);
    }
}

// build a single card
function buildOneCard(art) {
    let card = document.createElement("div");
    card.className = "newscard";

    // figure out image
    let picPart = "";
    if (art.urlToImage) {
        picPart = `<img class="cardpic" src="${art.urlToImage}" alt="news image" onerror="this.outerHTML='<div class=nopic>No image</div>'">`;
    } else {
        picPart = `<div class="nopic">📷 No image</div>`;
    }

    // source name
    let where = art.source && art.source.name ? art.source.name : "Unknown";

    // description
    let info = art.description ? art.description : "No description.";

    // date
    let when = "";
    if (art.publishedAt) {
        let d = new Date(art.publishedAt);
        when = d.toDateString();
    }

    // is this already saved?
    let alreadySaved = isItSaved(art.url);
    let btnClass = alreadySaved ? "saveit done" : "saveit";
    let btnText = alreadySaved ? "✅ Saved" : "🔖 Save";

    // encode article so we can pass it to the save function
    let encoded = encodeURIComponent(JSON.stringify(art));

    card.innerHTML = `
        ${picPart}
        <div class="cardwords">
            <p class="sourcename">${where}</p>
            <p class="newstitle">${art.title}</p>
            <p class="shortinfo">${info}</p>
            <p class="pubdate">${when}</p>
            <div class="btnrow">
                <a class="readmore" href="${art.url}" target="_blank">Read More</a>
                <button class="${btnClass}" onclick="toggleSave(this, '${encoded}')">${btnText}</button>
            </div>
        </div>
    `;

    return card;
}

// save or unsave an article
function toggleSave(btn, encoded) {
    let art = JSON.parse(decodeURIComponent(encoded));

    if (isItSaved(art.url)) {
        // remove from saved list
        mySaved = mySaved.filter(function (item) {
            return item.url !== art.url;
        });
        btn.textContent = "🔖 Save";
        btn.classList.remove("done");
    } else {
        // add to saved list
        mySaved.push(art);
        btn.textContent = "✅ Saved";
        btn.classList.add("done");
    }

    localStorage.setItem("mySavedArticles", JSON.stringify(mySaved));
    updateSavedButton();
}

// check if an article is already saved
function isItSaved(url) {
    return mySaved.some(function (item) {
        return item.url == url;
    });
}

// update the saved tab button in the nav
function updateSavedButton() {
    let btn = document.getElementById("savedbtn");
    let num = document.getElementById("howmany");
    if (mySaved.length > 0) {
        btn.style.display = "inline-block";
        num.textContent = mySaved.length;
    } else {
        btn.style.display = "none";
    }
}

// show saved section
function showSaved() {
    document.getElementById("newsarea").style.display = "none";
    document.getElementById("savedarea").style.display = "block";

    if (mySaved.length == 0) {
        document.getElementById("savedEmpty").style.display = "block";
        document.getElementById("savedcards").innerHTML = "";
    } else {
        document.getElementById("savedEmpty").style.display = "none";
        makeCards(mySaved, "savedcards");
    }
}

function closeSaved() {
    document.getElementById("savedarea").style.display = "none";
    document.getElementById("newsarea").style.display = "block";
}

// show/hide message helpers
function showWaiting() {
    document.getElementById("waitMsg").style.display = "block";
    document.getElementById("oopsMsg").style.display = "none";
    document.getElementById("nothingMsg").style.display = "none";
    document.getElementById("allcards").innerHTML = "";
}

function showOops() {
    document.getElementById("waitMsg").style.display = "none";
    document.getElementById("oopsMsg").style.display = "block";
}

function showNothing() {
    document.getElementById("waitMsg").style.display = "none";
    document.getElementById("nothingMsg").style.display = "block";
    document.getElementById("allcards").innerHTML = "";
}

function hideAllMsgs() {
    document.getElementById("waitMsg").style.display = "none";
    document.getElementById("oopsMsg").style.display = "none";
    document.getElementById("nothingMsg").style.display = "none";
}

// sample articles to show when no api key
let sampleArticles = [
    {
        title: "OpenAI just released GPT-5 and it is much smarter",
        description: "OpenAI released GPT-5 today. Early users say it is way better at math and coding. Big news in the AI world.",
        url: "https://openai.com",
        urlToImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
        publishedAt: new Date().toISOString(),
        source: { name: "TechCrunch" }
    },
    {
        title: "Bitcoin crossed $100,000 for the very first time",
        description: "Bitcoin hit 100k today. Experts say big companies are now buying it through ETFs which caused the price to go up.",
        url: "https://coindesk.com",
        urlToImage: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600&q=80",
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: { name: "CoinDesk" }
    },
    {
        title: "Apple Vision Pro 2 leak shows a much lighter design",
        description: "A leak says Apple is making a lighter Vision Pro 2. The first one was too heavy for most people so this is good news.",
        url: "https://9to5mac.com",
        urlToImage: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        source: { name: "9to5Mac" }
    },
    {
        title: "A startup nobody heard of just got $50 million in funding",
        description: "A small startup from San Francisco raised $50 million to build AI tools for hospitals. Pretty interesting.",
        url: "https://techcrunch.com",
        urlToImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80",
        publishedAt: new Date(Date.now() - 10800000).toISOString(),
        source: { name: "VentureBeat" }
    },
    {
        title: "Google DeepMind AI can now write full programs by itself",
        description: "DeepMind showed an AI that writes code without any human help. It even fixed its own bugs. Kind of wild.",
        url: "https://deepmind.com",
        urlToImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80",
        publishedAt: new Date(Date.now() - 14400000).toISOString(),
        source: { name: "The Verge" }
    },
    {
        title: "Samsung Galaxy S26 has live language translation built in",
        description: "The Galaxy S26 can translate conversations between languages in real time. It even works offline which is impressive.",
        url: "https://samsung.com",
        urlToImage: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80",
        publishedAt: new Date(Date.now() - 18000000).toISOString(),
        source: { name: "Android Authority" }
    }
];

function loadSampleNews() {
    hideAllMsgs();
    makeCards(sampleArticles, "allcards");
}
