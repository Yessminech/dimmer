let lampCounter = 0;
let lampState = {};
let profiles = {};
let predefined_profiles = {};

// Lamps control functions //

// Add a new lamp to the list
function addLamp() {
    const lampName = prompt("Enter the name of the lamp:");
    if (lampName) {
        const lampsDropdown = document.getElementById('lamps');
        const existingLamp = Array.from(lampsDropdown.options).find(option => option.text === lampName);
        if (existingLamp) {
            alert("Lamp name already exists. Please choose a different name.");
            return;
        }
        lampCounter++;
        const option = document.createElement('option');
        option.value = lampCounter;
        option.text = lampName;
        lampsDropdown.add(option);
        lampState[lampCounter] = { brightness: 100, isOn: true };
        // Set the new lamp as selected
        lampsDropdown.value = lampCounter;
        // Save custom name to localStorage
        const customNames = JSON.parse(localStorage.getItem('customLampNames')) || {};
        customNames[lampCounter] = lampName;
        localStorage.setItem('customLampNames', JSON.stringify(customNames));
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
    // TODO lampCounter-- if we want to reuse the lamp number;
    delete lampState[lamp];
    displayLamp();
}

// Remove all lamps 
function removeAllLamps() {
    const lampsDropdown = document.getElementById('lamps');
    lampsDropdown.innerHTML = '';
    for (const lamp in lampState) {
        const lampControl = document.getElementById(`lampControl${lamp}`);
        if (lampControl) {
            lampControl.remove();
        }
    }
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
    const selectedLamps = Array.from(document.getElementById('lamps').selectedOptions)
        .map(option => option.value);
    const lampControls = document.getElementById('lampControls');
    lampControls.innerHTML = '';

    selectedLamps.forEach(lamp => {
        const lampName = document.querySelector(`#lamps option[value="${lamp}"]`).text;
        lampControls.innerHTML += generateLampControlHTML(lamp, lampName);
    });
}
function generateLampControlHTML(lamp, lampName) {
    const { brightness, isOn } = lampState[lamp];
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

// Save all the current lamps as a profile
function saveProfile() {
    const profileName = prompt("Enter the name of the profile:");
    if (profileName) {
        if (profiles[profileName]) {
            alert("Profile name already exists. Please choose a different name.");
            return;
        }
        profiles[profileName] = JSON.parse(JSON.stringify(lampState));
        const profilesDropdown = document.getElementById('profiles');
        const option = document.createElement('option');
        option.value = profileName;
        option.text = profileName;
        profilesDropdown.add(option);
        profilesDropdown.value = profileName;
        alert("Profile saved successfully!");
    }
}

// Profiles control functions //

// Load predefined profiles from a JSON file
document.addEventListener('DOMContentLoaded', () => {
    selectProfilesFromFile();
});
function selectProfilesFromFile() {
    fetch('predefined_profiles.json')
        .then(response => response.json())
        .then(data => {
            predefined_profiles = data;
            populateProfilesDropdown();
        })
        .catch(error => console.error('Error loading predefined profiles:', error));
}
function populateProfilesDropdown() {
    const profilesDropdown = document.getElementById('predefined_profiles');
    profilesDropdown.innerHTML = `
    <option value="" selected>Choose your profile</option>
    ${Object.keys(predefined_profiles).map(profileName => `
        <option value="${profileName}">${profileName}</option>
    `).join('')}
    `;
}
function selectPredefinedProfile() {
    const selectedProfile = document.getElementById('predefined_profiles').value;
    if (selectedProfile && predefined_profiles[selectedProfile]) {
        lampState = predefined_profiles[selectedProfile];
        const lampsDropdown = document.getElementById('lamps');
        lampsDropdown.innerHTML = '';
        Object.keys(lampState).forEach(lamp => {
            const option = document.createElement('option');
            option.value = lamp;
            option.text = lamp;
            option.disabled = true;
            lampsDropdown.add(option);
        });
        displayLamp();
    }
}

// Remove the selected saved profile and associated lamps
function removeProfile() {
    const selectedProfile = document.getElementById('profiles').value;
    if (selectedProfile && profiles[selectedProfile]) {
        const lampsToRemove = Object.keys(profiles[selectedProfile]);
        lampsToRemove.forEach(lamp => {
            delete lampState[lamp];
            const lampsDropdown = document.getElementById('lamps');
            for (let i = 0; i < lampsDropdown.options.length; i++) {
                const option = lampsDropdown.options[i];
                if (option.value === lamp) {
                    option.selected = false;
                    lampsDropdown.remove(i);
                    break;
                }
            }
        });
        delete profiles[selectedProfile];
        const profilesDropdown = document.getElementById('profiles');
        for (let i = 0; i < profilesDropdown.options.length; i++) {
            const option = profilesDropdown.options[i];
            if (option.value === selectedProfile) {
                option.selected = false;
                profilesDropdown.remove(i);
                break;
            }
        }

        displayLamp(); alert("Profile and associated lamps removed successfully!");
    }
}


// Reload the predefined profiles and display the lamps
function reloadProfiles() {
    removeAllLamps();
    selectProfilesFromFile();
    populateProfilesDropdown();
}

// Select a saved profile and display the lamps
function selectProfile() {
    const selectedProfile = document.getElementById('profiles').value;
    if (selectedProfile && profiles[selectedProfile]) {
        lampState = profiles[selectedProfile];
        const lampsDropdown = document.getElementById('lamps');
        lampsDropdown.innerHTML = '';
        // Retrieve custom names from localStorage
        const customNames = JSON.parse(localStorage.getItem('customLampNames')) || {};
        Object.keys(lampState).forEach(lamp => {
            const option = document.createElement('option');
            option.value = lamp;
            option.text = customNames[lamp] || lamp; // Use custom name if available
            lampsDropdown.add(option);
            // Update the slider value and call updateSliderPWM for each lamp
            const slider = document.getElementById(`pwmSlider${lamp}`);
            const sliderValue = slider.value;
            fetch(`/brightness?lamp=${lamp}&value=${sliderValue}`);
            });
        displayLamp();
    }
}

// Export the saved profiles as a JSON file
function exportProfiles() {
    const exportProfiles = () => {
        if (Object.keys(profiles).length > 0) {
            const exportedProfiles = JSON.stringify(profiles, null, 2); // Pretty print JSON
            const blob = new Blob([exportedProfiles], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'saved_profiles.json';
            link.click();
            URL.revokeObjectURL(url);
            alert("Profiles exported successfully!");
        } else {
            alert("No profiles to export!");
        }
    };
    exportProfiles();
}