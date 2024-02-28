const renderDashboard = () => {
    const dashboard = document.createElement('div');
    dashboard.className = 'dashboard';
    dashboard.style.position = 'absolute';
    dashboard.style.top = '0'
    dashboard.style.zIndex = '9999';
    dashboard.style.backgroundColor = 'white';
    dashboard.style.padding = '10px';
    dashboard.style.border = '1px solid #000';
    dashboard.style.borderRadius = '5px';
    dashboard.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    dashboard.style.maxHeight = '400px';
    dashboard.style.overflowY = 'scroll';
    dashboard.style.width = '400px'; 
    dashboard.style.marginLeft = '5px';
    dashboard.style.marginTop = '5px';
    dashboard.innerHTML = `
        <div class="tab-container">
            <button class="tab-button" id="tab1">Captions</button>
            <button class="tab-button" id="tab2">Participants</button>
            <button class="tab-button" id="tab3">Analytics</button>

            <div id="tab1" class="tab active captions">
                <h2>Live Captions</h2>
                <p>Your live captions goes here......</p>
            </div>
            <div id="tab2" class="tab">
                <h2>Participants</h2>
                <p></p>
            </div>
            <div id="tab3" class="tab">
                <h2>Tab 3 Content</h2>
                <p>This is the content of tab 3.</p>
            </div>
        </div>
    `;
    document.querySelector('body').appendChild(dashboard);
    console.log("Injected dashboard!!")
}

renderDashboard();