// content.js
// Description: Handles all the webpage level activities (e.g. manipulating page data, etc.)

// Global Vairables
let subtitlesButton = null

// Global Functions
const renderDashboard = () => {
    const dashboard = document.createElement('div');
    dashboard.className = 'dashboard';
    dashboard.style.position = 'absolute';
    dashboard.style.top = '0'
    dashboard.style.zIndex = '9999';
    dashboard.style.backgroundColor = 'white';
    dashboard.style.padding = '20px';
    dashboard.style.border = '1px solid #000';
    dashboard.style.borderRadius = '5px';
    dashboard.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    dashboard.innerHTML = `
        <h1>Dashboard</h1>
        <p>Subtitle content goes here...</p>
    `;
    document.querySelector('body').appendChild(dashboard);
    console.log("Injected dashboard!")
}
const subtitlesHandler = () =>{
    console.log("Starting with subtitles...")
    const subtitlesSettings = document.evaluate('//*[contains(text(), "Captions settings")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE).snapshotItem(0);
    console.log(subtitlesSettings);


}

renderDashboard();

// Main Logic to start the subtitles
const interval  = setInterval(() => {
    const foundDiv =  document.evaluate('//*[contains(text(), "Turn on captions")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE).snapshotItem(0);
    if (foundDiv) {
        clearInterval(interval);
        const parent = foundDiv.parentElement;
        // getting the first child of the parent element
        subtitlesButton = parent.children[0];
        console.log(subtitlesButton);
        subtitlesButton.click();
        subtitlesHandler();
    }
}, 1000)
