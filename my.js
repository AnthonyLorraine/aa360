// document.getElementById('date-string-input').addEventListener('input', (event) => {
//     const monthNameRegex = /(January|February|March|April|May|June|July|August|September|October|November|December)/i;
//     const monthShortNameRegex = /(Jan\.|Feb\.|Mar\.|Apr\.|May|Jun\.|Jul\.|Aug\.|Sep\.|Oct\.|Nov\.|Dec\.)/i;
//     const timeRegex = new RegExp(`\\b([01]?\\d|2[0-3]):?([0-5]?\\d):?([0-5]?\\d)\\b`, 'g');
//
//     let answer = event.target.value;
//     if (timeRegex.test(answer)) {
//         if (answer.includes(':')) {
//             console.log(answer)
//         } else {
//
//         }
//         answer = answer.replace(timeRegex, 'TIME');
//     }
//     // Check and replace full month names
//     if (monthNameRegex.test(answer)) {
//         answer = answer.replace(monthNameRegex, 'FULL_MONTH');
//     }
//
//     // Check and replace short month names
//     if (monthShortNameRegex.test(answer)) {
//         answer = answer.replace(monthShortNameRegex, 'SHORT_MONTH');
//     }
//
//     document.getElementById('answer').innerText = answer
// })

const content = document.getElementById('content')
const menuItems = document.querySelectorAll('a.nav-link')
const guideNavItems = document.querySelectorAll('#guides-nav a')

const clearNavActiveStatus = () => {
    for (let i = 0; i < menuItems.length; i++) {
        menuItems[i].classList.remove('active')
    }
}

function setCookie(name, value, daysToExpire) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + daysToExpire);

    document.cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
}

function getCookie(name) {
    const cookies = document.cookie.split('; ');

    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');

        if (cookieName === name) {
            return cookieValue;
        }
    }

    return null;
}

const changeContentEventHandler = (event) => {
    clearNavActiveStatus()
    event.target.classList.add('active')
    let htmlFileName = event.target.getAttribute('data-html')
    setCookie('currentPage', htmlFileName, 1)
    changeContent(htmlFileName)
}
const changeContent = (htmlFileName) => {
    let htmlFile = htmlFileName + '.html'

    fetch(htmlFile)
        .then(response => response.text())
        .then(htmlContent => {
            // Set the HTML content of the div
            content.innerHTML = htmlContent;
        })
        .catch(error => console.error('Error loading HTML File:', error));
}

for (let i = 0; i < menuItems.length; i++) {
    menuItems[i].addEventListener('click', changeContentEventHandler)
}

let currentPage = getCookie('currentPage')

if (currentPage !== null) {
    changeContent(currentPage)
} else {
    changeContent('home')
}

const clearGuideNavActiveStatus = () => {
    for (let i = 0; i < guideNavItems.length; i++) {
        guideNavItems[i].classList.remove('active')
    }
}


const changeGuideEventHandler = (element) => {
    clearGuideNavActiveStatus()
    element.classList.add('active')
    let htmlFileName = element.getAttribute('data-html')
    setCookie('currentGuide', htmlFileName, 1)
    renderMarkdown(htmlFileName)
}
const renderMarkdown = (markdownFileName) => {
    let converter = new showdown.Converter()
    const guidesSection = document.getElementById('guides-markdown');

    let markdownPath = ".\\guides\\" + markdownFileName + ".md"

    fetch(markdownPath)
        .then(response => response.text())
        .then(mdContent => {
            guidesSection.innerHTML = converter.makeHtml(mdContent);
        })
        .catch(error => console.error('Error loading HTML File:', error));

}

const setCurrentGuide = () => {
    let currentGuide = getCookie('currentGuide')

    if (currentGuide !== null) {
        renderMarkdown(currentGuide)
    }
}