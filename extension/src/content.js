// content.js
// Description: Handles all the webpage level activities (e.g. manipulating page data, etc.)

// Global Vairables
let subtitlesButton = null
let subtitlesContent = []

// Global Functions
const updateSubtitles = ({name, text}) =>{
    // console.log(name, text);
    text = text.trim();
    text = text.toLowerCase();
    if(text[text.length-1] === "."){
        text = text.slice(0, text.length-1);
    }
    // remove all the non alphanumeric characters
    text = text.replace(/[^a-zA-Z0-9 ]/g, "");

    for(let i=0; i<subtitlesContent.length; i++){
        if(subtitlesContent[i].name === name && text.startsWith(subtitlesContent[i].text)){
            subtitlesContent[i].text = text;
            return;
        }
    }
    subtitlesContent.push({name, text});
}
const updateDashboard = () => {
    const dashboard = document.querySelector('.captions');
    dashboard.innerHTML = `
        <h1>Captions</h1>
        <ul>
            ${subtitlesContent.map(subtitle => `<li><strong>${subtitle.name}</strong>: ${subtitle.text}</li>`).join('')}
        </ul>
        <div style="text-align:center;">
            <button class="sec-button">Clean Captions</button>
            <button class="sec-button">Download Captions</button>
        </div>
    `;
    document.querySelector('.dashboard').scrollTop = dashboard.scrollHeight;
}

const subtitlesHandler = () =>{
    console.log("Starting with subtitles...")
    const subtitlesSettings = document.evaluate('//*[contains(text(), "Captions settings")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE).snapshotItem(0);
    // console.log(subtitlesSettings);

    const subtitlesContainer = subtitlesSettings.parentElement.parentElement.parentElement.parentElement;
    subtitlesContainer.style.height = 0;

    const subtitles = subtitlesContainer.children[0].children[0];
    // console.log('Targeted subtitles are.....', subtitles);


    // Mutation Observer to observe the changes in the subtitles
    const config = { characterData: true, attributes: false, childList: false, subtree: true };
    const observer = new MutationObserver((mutationsList, observer) => {
        console.log('Subtitles changed...');
        for(let i=0; i<subtitles.children.length; i++){
            const persons = subtitles.children[i];
            // console.log(persons);
            
            // capturing the name of the person
            const name = persons.children[0].children[1].textContent;
            const textContainer = persons.children[1];

            // capturing the text of the person
            let text = "";
            for(let j=0; j<textContainer.children[0].children.length; j++){
                text+= String(textContainer.children[0].children[j].textContent);
            }
            updateSubtitles({name, text})
        }

        // checking if any text is prefix of another text and removing the prefix
        for(let i=0; i<subtitlesContent.length; i++){
            for(let j=0; j<subtitlesContent.length; j++){
                if(i!==j && subtitlesContent[i].text.startsWith(subtitlesContent[j].text)){
                    subtitlesContent[j].text = subtitlesContent[i].text;
                }
            }
        }
        // removing the duplicate subtitles
        subtitlesContent = subtitlesContent.filter((subtitle, index) => {
            return subtitlesContent.findIndex(sub => sub.text === subtitle.text) === index;
        })
        
        console.log(subtitlesContent);
        updateDashboard()
    });
    observer.observe(subtitles, config);
}

// Main Logic to start the subtitles
const interval  = setInterval(() => {
    const foundDiv =  document.evaluate('//*[contains(text(), "Turn on captions")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE).snapshotItem(0);
    if (foundDiv) {
        clearInterval(interval);
        const parent = foundDiv.parentElement;
        // getting the first child of the parent element
        subtitlesButton = parent.children[0];
        // console.log(subtitlesButton);
        subtitlesButton.click();
        subtitlesHandler();
    }
}, 1000)
