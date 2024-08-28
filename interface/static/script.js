let lampMax = 9;
let lampConnected = prompt("Enter the number Lamps to control:"); 
if (lampConnected > lampMax) {
    alert("The maximum number of lamps is " + lampMax + ". Please enter a number less than or equal to " + lampMax + ".");
    lampConnected = lampMax;
}
let lampCounter = 0;
let lampState = {};
let profiles = {};
let deletedLampIds = []; 

// Lamps control functions //

// Add a new lamp to the list
function addLamp() {
    console.log("lampCounter: ", lampCounter);
    if (lampCounter >= lampConnected && deletedLampIds.length === 0) {
        alert("The maximum number of lamps is " + lampConnected + ". Please remove a lamp before adding a new one.");
        return;
    }
    let lampId;
    if (deletedLampIds.length > 0) {
        lampId = deletedLampIds.pop(); // Reuse the last deleted lamp ID
        alert("This value will be assigned to lamp:" + lampId);
        lampCounter++;
    } else {
        lampId = ++lampCounter; // Use a new lamp ID
        alert("This value will be assigned to lamp:" + lampId);
    }
    const lampName = prompt("Enter the name of the lamp:");
    if (lampName) {
        const lampsDropdown = document.getElementById('lamps');
        const existingLamp = Array.from(lampsDropdown.options).find(option => option.text === lampName);
        if (existingLamp) {
            alert("Lamp name already exists. Please choose a different name.");
            return;
        }
        const option = document.createElement('option');
        option.value = lampId;
        option.text = lampName;
        lampsDropdown.add(option);
        lampState[lampId] = {id: lampId, name: lampName, brightness: 100, isOn: true };
        // Set the new lamp as selected
        lampsDropdown.value = lampId;
        displayLamp();
    }
}

// Remove the selected lamp from the list
function removeLamp(lamp) {
    const lampControl = document.getElementById(`lampControl${lamp}`);
    if (lampControl) {
        lampControl.remove();
    }
    const lampsDropdown = document.getElementById('lamps');
    for (let i = 0; i < lampsDropdown.options.length; i++) {
        const option = lampsDropdown.options[i];
        if (option.value === lamp.toString()) {
            option.selected = false;
            lampsDropdown.remove(i);
            break;
        }
    }
    lampCounter--;
    deletedLampIds.push(lamp); 
    delete lampState[lamp];
    // Select the last remaining lamp option if any
    if (lampsDropdown.options.length > 0) {
        lampsDropdown.selectedIndex = lampsDropdown.options.length - 1;
        displayLamp();
    } else {
        document.getElementById('lampControls').innerHTML = '';
    }
}

//TODO Correct this! 
// Remove all lamps 
function removeAllLamps() {
    const lampsDropdown = document.getElementById('lamps');
    lampsDropdown.innerHTML = '';
    lampState = {};
    lampCounter = 0;
}

// Reset all lamps to 100% brightness
function reset() {
    Object.keys(lampState).forEach(lamp => {
        lampState[lamp].brightness = 100;
        const slider = document.getElementById(`pwmSlider${lamp}`);
        if (slider) {
            slider.value = 100;
            document.getElementById(`textSliderValue${lamp}`).innerText = 100;
        }
        fetch(`/brightness?lamp=${lamp}&value=100`);
        lampState[lamp].isOn = true;
        const switchElement = document.getElementById(`lamp${lamp}Switch`);
        if (switchElement) {
            switchElement.checked = true;
        }
        fetch(`/toggle?lamp=${lamp}&value=100`);
    });
}

// Display the selected lamps with brightness control
function displayLamp() {
    const selectedLamps = Array.from(document.getElementById('lamps').selectedOptions); // Convert selectedOptions to an array
    const lampControls = document.getElementById('lampControls');
    lampControls.innerHTML = '';
    selectedLamps.forEach(lamp => {
    if (lamp.value === document.getElementById('lamps').value) {
        lampControls.innerHTML += generateLampControlHTML(lamp.value, lamp.text); // Use lamp.value for id and lamp.text for name
    }
    });
}

function generateLampControlHTML(lamp, lampName) {
    const { id , name , brightness, isOn } = lampState[lamp];
    return `
        <div id="lampControl${lamp}" class="my-3 row align-items-center">
            <div class="col-md-3">
                <span>Brightness Level: <span id="textSliderValue${lamp}">${brightness}</span>%</span>
            </div>
            <div class="col-md-6 d-flex justify-content-center align-items-center">
                <button class="btn btn-outline-secondary" onclick="decreaseSliderValue(${lamp})">-</button>
                <input type="range" id="pwmSlider${lamp}" min="0" max="100" value="${brightness}" class="slider mx-2" aria-label="${lampName} Brightness" style="width: 450px;" oninput="updateSliderPWM(${lamp}, this)">
                <button class="btn btn-outline-secondary" onclick="increaseSliderValue(${lamp})">+</button>
                <label class="switch ml-2" style="width: 70px;">
                    <input type="checkbox" id="lamp${lamp}Switch" class="toggle-switch" onclick="toggleLamp(${lamp})" ${isOn ? 'checked' : ''}>
                    <span class="switch_slider"></span>
                </label>
            </div>
            <div class="col-md-3 text-right">
                <button class="btn btn-danger mx-2" onclick="removeLamp(${lamp})">Remove</button>
            </div>
        </div>
    `;
}

// Slider control functions
function updateSliderPWM(lamp, element) {
    const sliderValue = element.value;
    document.getElementById(`textSliderValue${lamp}`).innerText = sliderValue;
    lampState[lamp].brightness = sliderValue;
    fetch(`/brightness?lamp=${lamp}&value=${sliderValue}`);
    const checkbox = document.getElementById(`lamp${lamp}Switch`);
    checkbox.checked = sliderValue > 0;
    lampState[lamp].isOn = sliderValue > 0;
}
function increaseSliderValue(lamp) {
    const slider = document.getElementById(`pwmSlider${lamp}`);
    const newValue = Math.min(parseInt(slider.value) + 1, 100);
    slider.value = newValue;
    document.getElementById(`textSliderValue${lamp}`).innerText = newValue;
    const checkbox = document.getElementById(`lamp${lamp}Switch`);
    checkbox.checked = newValue > 0;
    lampState[lamp].brightness = newValue;
    fetch(`/brightness?lamp=${lamp}&value=${newValue}`);
}
function decreaseSliderValue(lamp) {
    const slider = document.getElementById(`pwmSlider${lamp}`);
    const newValue = Math.max(parseInt(slider.value) - 1, 0);
    slider.value = newValue;
    document.getElementById(`textSliderValue${lamp}`).innerText = newValue;
    const checkbox = document.getElementById(`lamp${lamp}Switch`);
    checkbox.checked = newValue > 0;
    lampState[lamp].brightness = newValue;
    fetch(`/brightness?lamp=${lamp}&value=${newValue}`);
}

// Toggle control functions
function toggleLamp(lamp) {
    const checkbox = document.getElementById(`lamp${lamp}Switch`);
    const slider = document.getElementById(`pwmSlider${lamp}`);
    const newValue = checkbox.checked ? 100 : 0;
    slider.value = newValue;
    lampState[lamp].brightness = newValue;
    lampState[lamp].isOn = checkbox.checked;
    document.getElementById(`textSliderValue${lamp}`).innerText = newValue;
    fetch(`/toggle?lamp=${lamp}&value=${newValue}`);
}

// Function to import a profile from a JSON file
function importProfile(event) {
const file = event.target.files[0];
if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedProfile = JSON.parse(e.target.result);
            const profileName = file.name.split('.').slice(0, -1).join('.'); // Extract the name from the file name without the extension
            profiles[profileName] = importedProfile;
            localStorage.setItem('profiles', JSON.stringify(profiles));

            // Update lampState with the imported profile's lamps
            Object.keys(importedProfile).forEach(lampId => {
                lampState[lampId] = importedProfile[lampId];
            });

            // Update the profiles dropdown
            const profilesDropdown = document.getElementById('profiles');
            const option = document.createElement('option');
            option.value = profileName;
            option.text = profileName;
            profilesDropdown.add(option);

            // Select the imported profile
            profilesDropdown.value = profileName;
            selectProfile();
            displayLamp();

            alert(`Profile "${profileName}" imported successfully!`);
        } catch (error) {
            alert('Failed to import profile. Please ensure the file is a valid JSON.');
        }
    };
    reader.readAsText(file);

}
}

// // Remove the selected saved profile and associated lamps
// function removeProfile() {
//     const selectedProfile = document.getElementById('profiles').value;
//     if (selectedProfile && profiles[selectedProfile]) {
//         const lampsToRemove = Object.keys(profiles[selectedProfile]);
//         lampsToRemove.forEach(lamp => {
//             delete lampState[lamp];
//             const lampsDropdown = document.getElementById('lamps');
//             for (let i = 0; i < lampsDropdown.options.length; i++) {
//                 const option = lampsDropdown.options[i];
//                 if (option.value === lamp) {
//                     option.selected = false;
//                     lampsDropdown.remove(i);
//                     break;
//                 }
//             }
//         });
//         delete profiles[selectedProfile];
//         const profilesDropdown = document.getElementById('profiles');
//         for (let i = 0; i < profilesDropdown.options.length; i++) {
//             const option = profilesDropdown.options[i];
//             if (option.value === selectedProfile) {
//                 option.selected = false;
//                 profilesDropdown.remove(i);
//                 break;
//             }
//         }

//         displayLamp(); alert("Profile and associated lamps removed successfully!");
//     }
// }


//TODO Check this fctn
// Reload the predefined profiles and display the lamps
    // Reload the predefined profiles and display the lamps
    function reloadProfiles() {
        // Clear existing profiles and lamps
        profiles = {};
        const profilesDropdown = document.getElementById('profiles');
        profilesDropdown.innerHTML = ''; // Clear the profiles dropdown
        const lampsDropdown = document.getElementById('lamps');
        lampsDropdown.innerHTML = ''; // Clear the lamps dropdown

        // Load profiles from local storage
        const storedProfiles = JSON.parse(localStorage.getItem('profiles')) || {};

        // Update the profiles object and dropdown
        Object.keys(storedProfiles).forEach(profileName => {
            profiles[profileName] = storedProfiles[profileName];
            const option = document.createElement('option');
            option.value = profileName;
            option.text = profileName;
            profilesDropdown.add(option);
        });

        // Select the first profile if available and display its lamps
        if (profilesDropdown.options.length > 0) {
            profilesDropdown.selectedIndex = 0;
            selectProfile();
        }
    }

// Select a saved profile and display the lamps
function selectProfile() {
    const selectedProfile = document.getElementById('profiles');
    const profileName = selectedProfile.value;
    if (profileName && profiles[profileName]) {
        const profileLamps = profiles[profileName];
        const lampsDropdown = document.getElementById('lamps');
        lampsDropdown.innerHTML = ''; // Clear the lamps dropdown

        // Retrieve custom names from localStorage
        Object.keys(profileLamps).forEach(lampKey => {
            const lamp = profileLamps[lampKey];
            const option = document.createElement('option');
            option.value = lamp.id; 
            option.text = lamp.name; // Retrieve custom names 
            lampsDropdown.add(option);
            
            // Update the slider value and call updateSliderPWM for each lamp
            const slider = document.getElementById(`pwmSlider${lamp.id}`);
            if (slider) {
                const sliderValue = lamp.brightness;
                slider.value = sliderValue;
                document.getElementById(`textSliderValue${lamp.id}`).innerText = sliderValue;
                const checkbox = document.getElementById(`lamp${lamp.id}Switch`);
                checkbox.checked = lamp.isOn;
                lampState[lampKey].brightness = sliderValue;
                lampState[lampKey].isOn = lamp.isOn;
                fetch(`/brightness?lamp=${lamp.id}&value=${sliderValue}`);
            }
        });
        displayLamp();
    }
}
// Add/ Save all the current lamps as a profile and then export the profiles
function addAndExportProfile() {
    const profileName = prompt("Enter a name for the new profile:");
    if (profileName && !profiles[profileName]) {
        // Create a deep copy of the current lamp state
        const newProfile = JSON.parse(JSON.stringify(lampState));
        profiles[profileName] = newProfile;

        // Add the new profile to the profiles dropdown
        const profilesDropdown = document.getElementById('profiles');
        const option = document.createElement('option');
        option.value = profileName;
        option.text = profileName;
        profilesDropdown.add(option);
        // Save profiles to localStorage or server if needed
        localStorage.setItem('profiles', JSON.stringify(profiles));

        // Export the new profile as a JSON file
        const exportedProfile = JSON.stringify(profiles[profileName], null, 2); // Pretty print JSON
        const blob = new Blob([exportedProfile], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url; 
        link.download = `${profileName}_profile.json`; // TODO set the correct PATH
        link.click();
        URL.revokeObjectURL(url);
        alert(`Profile "${profileName}" exported successfully!`);
    } else {
        alert("Profile name is either empty or already exists.");
        return; // Exit the function if the profile name is invalid
    }
}