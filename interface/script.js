let lampCounter = 0;
let lampState = {};
let profiles = {};

document.addEventListener('DOMContentLoaded', () => {
    loadProfilesFromFile();
});

function loadProfilesFromFile() {
    fetch('profiles.json')
        .then(response => response.json())
        .then(data => {
            profiles = data;
            populateProfilesDropdown();
        })
        .catch(error => console.error('Error loading profiles:', error));
}

function populateProfilesDropdown() {
    const profilesDropdown = document.getElementById('profiles');
    profilesDropdown.innerHTML = '';
    Object.keys(profiles).forEach(profileName => {
        const option = document.createElement('option');
        option.value = profileName;
        option.text = profileName;
        profilesDropdown.add(option);
    });
}

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
        lampsDropdown.value = lampCounter;
        displayLamp();
    }
}

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
                    <span class="switch_slider round"></span>
                </label>
            </div>
            <div class="col-md-3 text-right">
                <button class="btn btn-danger btn-block" onclick="removeLamp(${lamp})">Remove</button>
            </div>
        </div>
    `;
}

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
    delete lampState[lamp];
    displayLamp();
}

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
    lampState[lamp].brightness = newValue;
    fetch(`/brightness?lamp=${lamp}&value=${newValue}`);
}

function decreaseSliderValue(lamp) {
    const slider = document.getElementById(`pwmSlider${lamp}`);
    const newValue = Math.max(parseInt(slider.value) - 1, 0);
    slider.value = newValue;
    document.getElementById(`textSliderValue${lamp}`).innerText = newValue;
    lampState[lamp].brightness = newValue;
    fetch(`/brightness?lamp=${lamp}&value=${newValue}`);
}

function toggleLamp(lamp) {
    const checkbox = document.getElementById(`lamp${lamp}Switch`);
    const slider = document.getElementById(`pwmSlider${lamp}`);
    const newValue = checkbox.checked ? 100 : 0;
    slider.value = newValue;
    lampState[lamp].brightness = newValue;
    lampState[lamp].isOn = checkbox.checked;
    fetch(`/toggle?lamp=${lamp}&value=${newValue}`);
}

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

function loadProfile() {
    const selectedProfile = document.getElementById('profiles').value;
    if (selectedProfile && profiles[selectedProfile]) {
        lampState = profiles[selectedProfile];
        const lampsDropdown = document.getElementById('lamps');
        lampsDropdown.innerHTML = '';
        Object.keys(lampState).forEach(lamp => {
            const option = document.createElement('option');
            option.value = lamp;
            option.text = `Lamp ${lamp}`;
            lampsDropdown.add(option);
        });
        displayLamp();
        alert("Profile loaded successfully!");
    }
}
