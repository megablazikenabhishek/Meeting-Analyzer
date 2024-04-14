// content.js
// Description: Handles all the webpage level activities (e.g. manipulating page data, etc.)

// Global Vairables
let subtitlesButton = null
let subtitlesContent = []
let ispaused = false;
let participantsButton = null
let user_name = "You"

// Global Functions
const updateSubtitles = ({oldText, name, text}) =>{
    for(let i=0; i<subtitlesContent.length; i++){
        if(subtitlesContent[i].name === name && subtitlesContent[i].text === oldText){
            subtitlesContent[i].text = text;
        }
    }
    // console.log(subtitlesContent);
}
const MergeSubtitles = () => {
    let subtitles_array = JSON.parse(JSON.stringify(subtitlesContent));
    let result = []
    for(let i=0; i<subtitles_array.length; i++){
        if(subtitles_array[i].text === "")
            continue;

        let curr_name = subtitles_array[i].name;
        let curr_text = subtitles_array[i].text;

        for(let j=i+1; j<subtitles_array.length; j++){
            if(subtitles_array[j].name === curr_name){
                curr_text += " " + subtitles_array[j].text;
                curr_text = curr_text.trim();
                subtitles_array[j].text = "";
                if(curr_text[curr_text.length-1] === "."){
                    break;
                }
            }
        }
        result.push({name: curr_name, text: curr_text});
    }

    // updating name
    for(let i=0; i<result.length; i++){
        if(result[i].name === "You")
            result[i].name = user_name
    }
    return result;
}
const updateDashboard = () => {
    // Merging the subtitles

    const result = MergeSubtitles();

    const dashboard = document.querySelector('.captions');
    dashboard.innerHTML = `
        <h1>Captions</h1>
        <ul>
            ${result.map(subtitle => `<li><strong>${subtitle.name}</strong>: ${subtitle.text}</li>`).join('')}
        </ul>
    `;
    // auto scroll to the bottom of the dashboard
    if(document.querySelector(".minimize-button").textContent === '-')
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
    const config = { characterData: true, attributes: false, childList: false, subtree: true, characterDataOldValue : true };
    const observer = new MutationObserver((mutationsList, observer) => {
        if(ispaused){
            return;
        }
        console.log('Subtitles changed...');
        console.log(mutationsList);
        for(let mutation of mutationsList){
            if(mutation.type === 'characterData'){
                const name = mutation.target.parentElement.parentElement.parentElement.parentElement.children[0].children[1].textContent.trim();
                const text = mutation.target.textContent.trim();
                const oldText = mutation.oldValue.trim();

                console.log("---->", name, oldText, text)

                if(oldText === "" && text !== ""){
                    subtitlesContent.push({name: name, text: text});
                }else if(text !== ""){
                    updateSubtitles({oldText, name, text});
                }
            }
        }
        
        console.log(JSON.stringify(subtitlesContent));
        updateDashboard()
    });
    observer.observe(subtitles, config);
}

// Main Logic to start the subtitles
const interval  = setInterval(() => {
    const foundDiv =  document.evaluate('//*[contains(text(), "Turn on captions")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE).snapshotItem(0);
    const participantsFound = document.evaluate('//*[contains(text(), "Show everyone")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE).snapshotItem(0);

    if (foundDiv) {
        clearInterval(interval);
        const parent = foundDiv.parentElement;
        // getting the first child of the parent element
        subtitlesButton = parent.children[0];
        participantsButton = participantsFound.parentElement.children[0];
        // console.log(subtitlesButton);
        subtitlesButton.click();
        subtitlesHandler();

        participantsButton.click();
        // getting participants info
        setTimeout(() => {
            console.log("Running Timeout..........")
            participantsButton.click();
            user_name = document.evaluate('//*[contains(text(), "(You)")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE).snapshotItem(0).previousSibling.textContent;
            console.log(user_name)
        }, 3500);
    }
}, 1000)
