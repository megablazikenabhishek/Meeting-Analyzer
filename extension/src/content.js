// content.js
// Description: Handles all the webpage level activities (e.g. manipulating page data, etc.)

// Global Vairables
let subtitlesButton = null
let subtitlesContent = []
let ispaused = false;
const backendUrl = "https://ideal-dollop-wqr5j7r795jf9x7w-5000.app.github.dev";

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
        <div style="text-align:center;">
            <button class="sec-button pause-button">Pause</button>
            <button class="sec-button download-button">Download</button>
            <button class="sec-button summary-button">Summary</button>
        </div>
    `;
    // auto scroll to the bottom of the dashboard
    document.querySelector('.dashboard').scrollTop = dashboard.scrollHeight;

    // Adding event listeners to pause and download buttons
    document.querySelector('.pause-button').addEventListener('click', (e) => {
        if(e.target.textContent === "Pause"){
            e.target.textContent = "Play";
            e.target.style.backgroundColor = "#ffcc00";
            ispaused = true;
            subtitlesButton.click();
        }else{
            e.target.textContent = "Pause";
            e.target.style.backgroundColor = "red";
            ispaused = false;
            subtitlesButton.click();
        }
    }); 
    
    document.querySelector('.download-button').addEventListener('click', async(e) => {
        try {
            const result = MergeSubtitles();
            const data = await fetch(`${backendUrl}/downloadTranscript`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({data: result})
            });
            const blob = await data.blob();

            // Create a temporary URL for the Blob object
            const url = URL.createObjectURL(blob);
            
            // Create a link element with the download attribute
            const link = document.createElement('a');
            link.href = url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            
            // Simulate a click on the link to trigger the download
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            
            // Clean up
            URL.revokeObjectURL(url);
        } catch (error) {
            console.log(error);
        }
    });

    document.querySelector('.summary-button').addEventListener('click', async(e) => {
        try {
            const result = MergeSubtitles();
            const data = await fetch(`${backendUrl}/generateSummary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({data: result})
            });
            const blob = await data.blob();

            // Create a temporary URL for the Blob object
            const url = URL.createObjectURL(blob);
            
            // Create a link element with the download attribute
            const link = document.createElement('a');
            link.href = url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            
            // Simulate a click on the link to trigger the download
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            
            // Clean up
            URL.revokeObjectURL(url);
        } catch (error) {
            console.log(error);
        }
    });
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
