const backendUrl = "https://studious-carnival-xg5pqw5wrj52vq7x-5000.app.github.dev";

const renderDashboard = () => {
    const dashboard = document.createElement('div');
    dashboard.className = 'dashboard';
    dashboard.style.position = 'absolute';
    dashboard.style.top = '0';
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
            <button class="minimize-button" style="height=20px; width=20px">-</button> <!-- Minimize Button -->
            <div class="tab-buttons">
                <button class="tab-button" id="tab1">Captions</button>
                <button class="tab-button" id="tab2">Participants</button>
                <button class="tab-button" id="tab3">Analytics</button>
            </div>

            <div id="tab1" class="tab active captions">
                <h2>Live Captions</h2>
                <p>Your live captions goes here......</p>
            </div>
            <div id="tab2" class="tab">
                <h2>Participants</h2>
                <p></p>
            </div>
            <div id="tab3" class="tab">
                <h2>Analytics</h2>
                <div style="text-align:center; display:flex; align-items:center">
                    <button class="sec-button pause-button">Pause</button>
                    <button class="sec-button download-button">Download</button>
                    <button class="sec-button summary-button">Summary</button>
                    <br/>
                    <button class="sec-button detailed-button">Detailed Report</button>
                </div>
            </div>
        </div>
    `;
    document.querySelector('body').appendChild(dashboard);

    // JavaScript code to handle minimize button functionality
    const minimizeButton = dashboard.querySelector('.minimize-button');
    minimizeButton.addEventListener('click', () => {
        if (minimizeButton.textContent === '+') {
            dashboard.style.height = 'auto';
            dashboard.style.overflowY = 'scroll';
            dashboard.style.width = '400px'; 
            dashboard.style.paddingTop = '10px';
            dashboard.style.paddingLeft = '10px';
            minimizeButton.textContent = '-';
        } else {
            dashboard.style.height = '16px'; // Minimize the dashboard
            dashboard.style.width = '20px';
            dashboard.style.overflow = 'hidden';
            minimizeButton.textContent = '+';
        }
    });

    console.log("Injected dashboard!!");

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
        
            if(data.status===500){
                const res = await data.json();
                alert(res.message)
                return new Error(res.message);
            }
           
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
            const ratio = parseInt(prompt("Enter the percentage of summary...."));
            const data = await fetch(`${backendUrl}/generateSummary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({data: result, ratio})
            });

            if(data.status===500){
                const res = await data.json();
                alert(res.message)
                return new Error(res.message);
            }

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

    document.querySelector('.detailed-button').addEventListener('click', async(e) => {
        try {
            const result = MergeSubtitles();
            const data = await fetch(`${backendUrl}/detailedAnalysis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({data: result})
            });

            if(data.status===500){
                const res = await data.json();
                alert(res.message)
                return new Error(res.message);
            }

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

    document.getElementById("tab2").addEventListener("click", (e)=>{
        participantsButton.click();
    })
}

renderDashboard();