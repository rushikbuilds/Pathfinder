import { Settings } from "./settings.js";
import { App } from "./app.js";
import { MinHeap } from "./minHeap.js";
import { MODE, ALGORITHM } from "./constants.js";

const settings = new Settings();
const app = new App(settings);
settings.setApp(app);

app.initialize();

// Synchronize initial algorithm setup
settings.setAlgorithm(settings.algorithm);

// Dropdown interactions
document.querySelectorAll(".dropdown").forEach(dropdown => {
    const btn = dropdown.querySelector("#dropdownBtn, .dropdown-btn");
    const menu = dropdown.querySelector(".dropdown-menu");
    const items = dropdown.querySelectorAll(".dropdown-item");

    if (!btn || !menu) return;

    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (btn.disabled) return;

        const isShown = menu.classList.contains("show");
        // Close all other dropdowns
        document.querySelectorAll(".dropdown-menu").forEach(m => {
            m.classList.remove("show");
            m.closest(".dropdown")?.classList.remove("open");
        });

        if (!isShown) {
            menu.classList.add("show");
            dropdown.classList.add("open");
        }
    });

    items.forEach(item => {
        item.addEventListener("click", (e) => {
            e.stopPropagation();
            const value = item.dataset.value;
            const action = dropdown.dataset.action;

            const labelElem = btn.querySelector(".dropdown-label");
            if (labelElem) {
                labelElem.textContent = item.textContent;
            } else {
                btn.textContent = item.textContent + " ▼";
            }

            items.forEach(i => i.classList.remove("selected"));
            item.classList.add("selected");

            menu.classList.remove("show");
            dropdown.classList.remove("open");
            handleSelection(action, value);
        });
    });
});

document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
        document.querySelectorAll(".dropdown-menu").forEach(menu => {
            menu.classList.remove("show");
            menu.closest(".dropdown")?.classList.remove("open");
        });
    }
});

// Slider controls
document.querySelectorAll('.slider-control').forEach(slider => {
    slider.addEventListener('input', handleSliderChange);
    handleSliderChange({ target: slider });
});

// Replanning toggle
const replanningToggle = document.getElementById('replanning-toggle');
if (replanningToggle) {
    replanningToggle.addEventListener('change', (e) => {
        settings.setEnableReplanning(e.target.checked);
    });
}

function handleSliderChange(e) {
    const slider = e.target;
    if (slider.disabled) return;
    const action = slider.dataset.action;
    const value = slider.value;

    const valueDisplay = document.querySelector('.slider-value[data-action="' + action + '"]');
    if (valueDisplay) {
        valueDisplay.textContent = action === "step-delay" ? value + " ms" : value;
    }

    if (action === "step-delay") {
        settings.setStepDelay(Number(value));
    } else if (action === "grid-size" && app.stopped) {
        settings.setSize(Number(value));
    } else if (action === "obstacle-density" && app.stopped) {
        settings.setObstacleDensity(parseFloat(value));
    }
}

function handleSelection(action, value) {
    if (action === "algorithm") {
        settings.setAlgorithm(value);
    }
    if (action === "heuristic") {
        settings.setHeuristic(value);
    }
}

// Start / Goal cell selection buttons
const selectStartBtn = document.getElementById("select-start-btn");
const selectGoalBtn = document.getElementById("select-goal-btn");

function updateSelectionButtons(mode) {
    if (selectStartBtn) {
        selectStartBtn.classList.toggle("active", mode === MODE.SELECTSTART);
    }
    if (selectGoalBtn) {
        selectGoalBtn.classList.toggle("active", mode === MODE.SELECTGOAL);
    }

    const statusBar = document.getElementById("status-bar");
    if (!statusBar || !app.stopped) return;

    if (mode === MODE.SELECTSTART) {
        statusBar.textContent = "Select Start: Click any cell on the grid (or click button to cancel)";
        statusBar.style.color = "#38bdf8";
    } else if (mode === MODE.SELECTGOAL) {
        statusBar.textContent = "Select Goal: Click any cell on the grid (or click button to cancel)";
        statusBar.style.color = "#c084fc";
    } else {
        statusBar.textContent = "Ready";
        statusBar.style.color = "#94a3b8";
    }
}

window.addEventListener("modechange", (e) => {
    updateSelectionButtons(e.detail?.mode ?? settings.mode);
});

if (selectStartBtn) {
    selectStartBtn.addEventListener("click", () => {
        if (settings.mode === MODE.SELECTSTART) {
            app.restoreGrid();
            settings.setMode(MODE.IDLE);
        } else {
            if (settings.mode === MODE.SELECTGOAL) {
                app.restoreGrid();
            }
            app.saveGridCopy();
            settings.setMode(MODE.SELECTSTART);
        }
    });
}

if (selectGoalBtn) {
    selectGoalBtn.addEventListener("click", () => {
        if (settings.mode === MODE.SELECTGOAL) {
            app.restoreGrid();
            settings.setMode(MODE.IDLE);
        } else {
            if (settings.mode === MODE.SELECTSTART) {
                app.restoreGrid();
            }
            app.saveGridCopy();
            settings.setMode(MODE.SELECTGOAL);
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        if (settings.mode !== MODE.IDLE) {
            app.restoreGrid();
            settings.setMode(MODE.IDLE);
        }
        document.querySelectorAll(".dropdown-menu").forEach(menu => {
            menu.classList.remove("show");
            menu.closest(".dropdown")?.classList.remove("open");
        });
    }
});

// Manage non-simulation interactive controls while running/paused
function setSimulationControlsEnabled(enabled) {
    const startBtn = document.getElementById("select-start-btn");
    const goalBtn = document.getElementById("select-goal-btn");
    const algoBtn = document.querySelector('.dropdown[data-action="algorithm"] #dropdownBtn, .dropdown[data-action="algorithm"] .dropdown-btn');
    const heuristicBtn = document.querySelector('.dropdown[data-action="heuristic"] #dropdownBtn, .dropdown[data-action="heuristic"] .dropdown-btn');
    const gridSizeSlider = document.querySelector('input[type="range"][data-action="grid-size"]');
    const obstacleDensitySlider = document.querySelector('input[type="range"][data-action="obstacle-density"]');
    const replanningInput = document.getElementById("replanning-toggle");

    if (startBtn) startBtn.disabled = !enabled;
    if (goalBtn) goalBtn.disabled = !enabled;
    if (algoBtn) algoBtn.disabled = !enabled;

    const isHeuristicApplicable = (settings.algorithm === ALGORITHM.GREEDY || settings.algorithm === ALGORITHM.ASTAR);
    if (heuristicBtn) {
        heuristicBtn.disabled = !enabled || !isHeuristicApplicable;
    }

    if (gridSizeSlider) gridSizeSlider.disabled = !enabled;
    if (obstacleDensitySlider) obstacleDensitySlider.disabled = !enabled;
    if (replanningInput) replanningInput.disabled = !enabled;
}

// Start or resume algorithm execution
function run() {
    const runButton = document.querySelector('button.btn-safe[value="run"]');
    const pauseButton = document.querySelector('button.btn-danger[value="pause"]');

    if (app.paused) {
        app.paused = false;
        runButton.textContent = "Run";
        runButton.disabled = true;
        pauseButton.disabled = false;
    } else {
        // If in cell selection mode, exit it
        if (settings.mode !== MODE.IDLE) {
            app.restoreGrid();
            settings.setMode(MODE.IDLE);
        }

        app.stopped = false;
        runButton.textContent = "Resume";
        runButton.disabled = true;
        pauseButton.disabled = false;
        setSimulationControlsEnabled(false);

        app.startLog();
        app.run().then(() => {
            runButton.textContent = "Run";
            runButton.disabled = false;
            pauseButton.disabled = true;
            setSimulationControlsEnabled(true);
        });
    }
}

// Pause algorithm execution
function pauseAlgorithm() {
    const runButton = document.querySelector('button.btn-safe[value="run"]');
    const pauseButton = document.querySelector('button.btn-danger[value="pause"]');
    runButton.textContent = "Resume";
    runButton.disabled = false;
    pauseButton.disabled = true;
    app.paused = true;
}

// Clear grid visualization while keeping algorithm selected
function clearGrid() {
    app.stopped = true;
    app.paused = false;
    app.controller.abort();
    app.controller = new AbortController();
    app.clearGrid();
    app.initializeVisitedHistory();
    app.endLog();

    const runButton = document.querySelector('button.btn-safe[value="run"]');
    const pauseButton = document.querySelector('button.btn-danger[value="pause"]');
    if (runButton) {
        runButton.textContent = "Run";
        runButton.disabled = false;
    }
    if (pauseButton) {
        pauseButton.disabled = true;
    }
    setSimulationControlsEnabled(true);
}

// Reset to initial state with fresh grid and obstacles
function reset() {
    const runButton = document.querySelector('button.btn-safe[value="run"]');
    const pauseButton = document.querySelector('button.btn-danger[value="pause"]');
    app.stop();
    app.reset();
    if (runButton) {
        runButton.textContent = "Run";
        runButton.disabled = false;
    }
    if (pauseButton) {
        pauseButton.disabled = true;
    }
    setSimulationControlsEnabled(true);
}

window.run = run;
window.pauseAlgorithm = pauseAlgorithm;
window.clearGrid = clearGrid;
window.reset = reset;
