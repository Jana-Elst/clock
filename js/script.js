//------------------------ VARIABLES ------------------------//
//time
let hour;
let minute;
let second;

let hourNow = -1;
let minuteNow = -1;
let secondNow = -1;

//series
/*series basis with nummers (array of 12) */
let basis = [];
let basisMinutes = [];
let basisSeconds = [];

/*series hours, minutes, seconds (array of 60 (minutes & seconds),array of 12 (hours)) */
/* numbers */
let hours = [];
let seconds;
let minutes;

/* colors */
let hourColors;
let minuteColors;
let secondColors;

/* notes */
let hourNotes;
let minuteNotes;
let secondNotes;

//elements for drawing
let hoursDraw = [];
let minutesDraw = [];
let secondsDraw = [];

//elements for music
let hourMusic = [];
let minuteMusic = [];
let secondMusic = [];

let sound = false;

//create canvas
const $canvas = document.querySelector(`.canvas`);
const context = $canvas.getContext(`2d`);

$canvas.width = window.innerWidth;
$canvas.height = window.innerHeight;

//buttons & manipulation
const $button = document.querySelector(`.button--sound`);
const $slider = document.querySelector(`.slider`);
const $button_img = document.querySelector(`.button__img`);
const $buttonChange = document.querySelector(`.button--change`);
const $buttonsCreateScale = document.querySelector(`.buttons--create_scale`);
const $buttonsChangeNote = $buttonsCreateScale.children;

//create notes
const chromatic = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
const colorsChromatic = ["#00501E", "#828282", "#1E3282", "#A01E1E", "#9FA0FF", "#E6BE1E", "#823CA0", "#C8C8C8", "#5A1E1E", "#3C82BE", "#C85A1E", "#BE1E82"];

//speed
let fps = 60;
let valueSlider = 100;
let speed = 1 / 2;

//------------------------ SMALL STATEMENTS ------------------------//
const change = (time, timeNow) => {
    let bool = false;

    if ((time - timeNow) != 0) {
        bool = true;
    }

    return bool;
}

const previous = (time, length) => {
    let previous = time - 1

    if (previous < 0) {
        previous = length;
    }

    return previous;
}

const isSilent = (notes) => {
    let silent = true;

    notes.forEach(note => {
        if (note != "silent") {
            silent = false;
        }
    });

    return silent;
}

//------------------------ TIME ------------------------//
const timeNow = () => {
    //tijd opvragen
    let date = new Date();
    hour = date.getHours();
    minute = date.getMinutes();
    second = date.getSeconds();

    if (hour >= 12) {
        hour -= 12;
    }
}

const time = () => {
    second++;

    if (second == 60) {
        second = 0;
        minute++

        if (minute == 60) {
            minute = 0;
            hour++;
        }

        if (hour == 12) {
            hour = 0;
        }
    }

    setTimeout(time, 1000 * speed);
    //console.log(`Manueel ${hour}, ${minute}, ${second}`);
}

//------------------------ SERIES ------------------------//
/* uren zijn de basisreeks vanaf deze reeks wordt alles berekend. 
eerst worden de reeksen in nummers gemaakt, deze nummers worden later omgezet in kleuren en noten
*/

/* de basisreeks wordt random bepaald */
const basisSerie = () => {
    //series with numbers
    basis = [];
    for (let i = 0; i < chromatic.length; i++) {
        //aanmaak basis
        let note = Math.floor(Math.random() * chromatic.length);
        while (basis.includes(note)) {
            note = Math.floor(Math.random() * chromatic.length);
        }
        basis.push(note);
    }
}

const serie = (basisSerie) => {
    let prime = basisSerie;
    let inversion = [];
    for (let i = 0; i < chromatic.length; i++) {
        //aanmaak inversion
        let inversionNote = (prime[0] - (prime[i] - prime[0]));

        if (prime[i] === "silent") {
            inversionNote = "silent";
        }

        inversion.push(inversionNote);
    }

    let retrograde = prime.toReversed();
    let inversionRetrograde = inversion.toReversed();

    let serie = [];
    prime.forEach(note => {
        serie.push(note);
    });

    retrograde.forEach(note => {
        serie.push(note);
    });

    inversion.forEach(note => {
        serie.push(note);
    });

    inversionRetrograde.forEach(note => {
        serie.push(note);
    });

    return serie;
}

/*de reeks wordt omgezet in arrays van 60 minuten/seconden */
/*deze reeks wordt onmiddelijk ook omgezet naar een reeks in kleuren en een reeks met noten namen*/
/* aanmaak van een array met 60 ingevulde plekjes */
const time60 = (serie48numbers) => {
    let k = 0;
    let serieNew = [];
    let serieColors = [];
    let serieNotes = [];

    for (let time = 0; time < 60; time++) {
        if (time == 0 || time == 59) {
            serieNew.push(["silent"]);
            serieColors.push(["silent"]);
            serieNotes.push(["silent"]);

        } else if ((time + 1) % 15 == 0 || time == 55) { //14, 29, 44
            let totSec = 2;
            let notesPerTime = 2;

            if (time == 55) {
                totSec = 4;
                notesPerTime = 3;
            }

            for (let i = 0; i < totSec; i++) {
                //for lus voor 1 seconde
                let twoElements = addNotes(serie48numbers, notesPerTime);

                serieNew.push(twoElements[0]);
                serieColors.push(twoElements[2]);
                serieNotes.push(twoElements[1]);

                time++;
            }
            twoNumbers = [];
            twoNotes = [];
            twoColors = [];
            time--;

        } else {
            serieNew.push([serie48numbers[k]]);
            serieColors.push([numberToColor(serie48numbers[k])]);
            serieNotes.push([numberToNote(serie48numbers[k])]);
            k++
        }
    }

    return [serieNew, serieColors, serieNotes];
}

let place = 0;
let twoNumbers = [];
let twoNotes = [];
let twoColors = [];
const addNotes = (serie48numbers, notesPerTime) => {
    let finalNumbers = [];
    let finalNotes = [];
    let finalColors = [];
    for (let j = 0; j < notesPerTime; j++) {

        twoNumbers.push(serie48numbers[place]);
        twoColors.push(numberToColor(serie48numbers[place]));
        twoNotes.push(numberToNote(serie48numbers[place]));

        if (place >= 11) {
            place = -1;
        }

        place++;
    }

    return [finalNumbers.concat(twoNumbers), finalNotes.concat(twoNotes), finalColors.concat(twoColors)];
}

/*transponeren van de reeks afh, van de noot van de bovenliggende reeks voor seconden is dit de reeks van de minuten */
const transpose = (serie, firstNote) => {
    let serieTranspose = [];
    let toneDifference = firstNote - serie[0];

    serie.forEach(note => {
        let noteNew = note + toneDifference

        if (firstNote === "silent") {
            noteNew = "silent";
        }

        serieTranspose.push(noteNew);
    })
    return serieTranspose;
}

//converting series to notes
const numberToNote = (number) => {
    let note = 'silent';

    if (number !== "silent") {
        let octave = 4;

        while (number > 11) {
            number = number - (chromatic.length);
            octave = octave + 1;
        }

        let x = 1;
        while (number < 0) {
            number = (chromatic.length) + number - x;
            octave = octave - 1;
            x--
        }

        note = `${chromatic[number]}${octave}`;
        x = 1;
    }

    return note;
}

//converting series to colors
const numberToColor = (number) => {
    let color = 'silent';

    if (number !== "silent") {
        while (number > 11) {
            number -= (chromatic.length);
        }

        let x = 1;
        while (number < 0) {
            number = number + (chromatic.length) - x;
            x--;
        }

        color = colorsChromatic[number];
        x = 1;
    }

    return color;
}

//aanmaak van alle verschillende reeksen
/*om de seconde worden de reeksen opnieuw gerefreshed*/
const noteTime = () => {
    //hours
    hours = basis;
    hourNotes = hours.map(note => numberToNote(note));
    hourColors = hours.map(note => numberToColor(note));

    //minutes
    basisMinutes = transpose(basis, basis[hour]);
    minutesSerie = serie(basisMinutes);
    minutes = time60(minutesSerie);

    minutesSerie = minutes[0];
    minuteColors = minutes[1];
    minuteNotes = minutes[2];

    //seconds
    let notesSecond = minutesSerie[minute];
    basisSeconds = transpose(basisMinutes, notesSecond[(notesSecond.length) - 1]); //akkoorden worden gecovered

    secondsSerie = serie(basisSeconds);
    seconds = time60(secondsSerie);

    secondsSerie = seconds[0];
    secondColors = seconds[1];
    secondNotes = seconds[2];

    setTimeout(noteTime, 1000 * speed);
}

//------------------------ ANIMATION ------------------------//
//--------- framespeed ---------//
let msPrev = 0;
//const fps = 60;
let msPerFrame = (1000 * speed) / fps;
let frames = 0;

const framerate = () => {
    const msNow = window.performance.now();
    const msPassed = msNow - msPrev;

    if (msPassed > msPerFrame) {
        const excessTime = msPassed % msPerFrame;
        msPrev = msNow - excessTime;
        frames++;
    }
}

//--------- create drawing elements ---------//
/* klasses */
class Hour {
    constructor(color, y) {
        this.x = 0;
        this.y = y;
        this.height = $canvas.height;
        this.width = $canvas.width;
        this.color = color;
    }

    updateHour() {
        this.y += ($canvas.height / ((fps) * speed * 2 * 60 * 60));
        this.drawHour();
    }

    drawHour() {
        context.beginPath();
        context.fillStyle = this.color;
        context.rect(this.x, this.y, this.width, this.height);
        context.fill();
    }
}

class Minute {
    constructor(color, y, numberOfNotes, location) {
        this.numberOfNotes = numberOfNotes
        this.location = location;
        this.height = $canvas.height;
        this.width = ($canvas.height / 60) * 12 / numberOfNotes;

        this.x = ($canvas.width / 2) - (($canvas.height / 60) * 6) + (this.location * this.width);
        this.y = y;

        this.color = color;
    }

    updateMinute() {
        this.y -= ($canvas.height / (fps * 60 * speed * 2));
        this.drawMinute();
    }

    drawMinute() {
        context.beginPath();
        context.fillStyle = this.color;
        context.rect(this.x, this.y, this.width, this.height);
        context.fill();
    }
}

class Second {
    constructor(color, location) {
        this.color = color;
        this.location = location;

        this.size = $canvas.height / 60;

        this.y = -this.size;
        this.x = ($canvas.width / 2) - (($canvas.height / 60) * 6) + (this.location * this.size);
    }

    updateSecond() {
        this.y += ($canvas.height / (fps * 60 * speed * 2));
        this.drawSecond();
    }

    drawSecond() {
        context.beginPath();
        context.fillStyle = this.color;
        context.rect(this.x, this.y, this.size, this.size);
        context.fill();
    }
}

const createMinutesDraw = (colors, y) => {
    let location = 0;
    let minute = [];
    if (!isSilent(colors)) {
        colors.forEach(color => {
            minute.push(new Minute(color, y, colors.length, location));
            location++;
        });
    } else {
        minute.push(new Minute(`white`, y, colors.length, location));
    }

    return minute;
}

const createSecondsDraw = (colors) => {
    if (!isSilent(colors)) {
        colors.forEach(color => {
            let location = colorsChromatic.indexOf(color);
            secondsDraw.push(new Second(color, location));
            location++;
        });
    }
}

//------------------------ MUSIC ------------------------//
const createSynths = () => {
    for (let i = 0; i < chromatic.length; i++) {
        hourMusic.push(new Tone.Synth().toDestination());
        minuteMusic.push(new Tone.Synth().toDestination());
        secondMusic.push(new Tone.Synth().toDestination());
    }
}

const playNote = (notesTime, music, time) => {
    let notes = notesTime[time];
    let locationNote = 0;
    stopMusic(music);
    if (!isSilent(notes)) {
        notes.forEach(note => {
            music[locationNote].triggerAttack(note);
            locationNote++;
        });
    }
}

const stopMusic = (synths) => {
    synths.forEach(synths => {
        synths.triggerRelease();
    });
}

//------------------------ CREATE ELEMENTS (drwing + music) ------------------------//
const createHour = () => {
    if (change(hour, hourNow)) {
        hoursDraw = new Hour(hourColors[hour], -($canvas.height) + ($canvas.height / 60) * minute);
        hourNow = hour;

        /*music*/
        if (sound) {
            hourMusic[0].triggerRelease();
            hourMusic[0].triggerAttack(hourNotes[hour]);
        }
    }
    setTimeout(createHour, 1000 * speed);
}

const createMinute = () => {
    if (change(minute, minuteNow)) {
        let colors = minuteColors[minute];
        minutesDraw = createMinutesDraw(colors, $canvas.height - ($canvas.height / 60) * second + 1.0001);

        /* music */
        if (sound) {
            playNote(minuteNotes, minuteMusic, minute);
        }

        minuteNow = minute;
    }
    setTimeout(createMinute, 1000 * speed);
}

const createSecond = () => {
    let colors = secondColors[second];
    createSecondsDraw(colors);

    /*music*/
    if (sound) {
        playNote(secondNotes, secondMusic, second);
    }

    setTimeout(createSecond, 1000 * speed);
}

//------------------------ INTERACTIONS ------------------------//
const buttonSoundClicked = async (event) => {
    if (sound) {
        sound = false;
    } else {
        sound = true;
    }

    if (sound) {
        await Tone.start()
        $button_img.setAttribute(`src`, `assets/sound_on.svg`);
        //console.log('audio on');

        /* eerste noten laten spelen */
        playNote(minuteNotes, minuteMusic, minute);

        hourMusic[0].triggerRelease();
        hourMusic[0].triggerAttack(hourNotes[hour]);

    } else {
        stopMusic(hourMusic);
        stopMusic(minuteMusic);
        stopMusic(secondMusic);
        $button_img.setAttribute(`src`, `assets/sound_off.svg`);
        //console.log('audio off');
    }
}

const sliderChange = (event) => {
    valueSlider = $slider.value;
    speed = 1 / (valueSlider / 100);
}

const buttonChangeClicked = (event) => {
    //change basisserie
    basisSerie();

    //change buttons
    for (var i = 0; i < $buttonsChangeNote.length; i++) {
        $buttonsChangeNote[i].textContent = `${hourNotes[i].slice(0, -1)}`;

        containColor($buttonsChangeNote[i]);

        const hourColor = hourColors[i].slice(1);
        $buttonsChangeNote[i].classList.add(`color${hourColor}`);
    }

    //change colors & music
    hourNow = -1;
    minuteNow = -1;
}

const buttonChangeNoteClicked = (event) => {
    console.log(`click`);
    const $button = event.target;
    let id = $button.getAttribute(`id`);
    id = id.slice(6);


    let colorNow = containColor($button);
    let i = colorsChromatic.indexOf(colorNow) + 1;

    if (i >= 12) {
        i = 0;
    }

    const color = colorsChromatic[i].slice(1);
    $button.classList.add(`color${color}`);
    $button.textContent = `${chromatic[i]}`;
    const note = numberToNote(i);

    basis[id] = i;

    //change colors & music
    hourNow = -1;
    minuteNow = -1;
}

const containColor = ($button) => {
    let colorNow;

    colorsChromatic.forEach(color => {
        color = color.slice(1);
        color = `color${color}`;

        if ($button.classList.contains(color)) {
            $button.classList.remove(color);
            colorNow = color;
        }
    });

    colorNow = `#${colorNow.substring(5)}`;
    return colorNow;
}

/* create buttons to change the basisserie */
const createButtons = () => {
    for (let i = 0; i < chromatic.length; i++) {
        const $buttonChangeNote = document.createElement('button');
        $buttonChangeNote.textContent = `${hourNotes[i].slice(0, -1)}`;

        $buttonChangeNote.classList.add(`button`);
        $buttonChangeNote.classList.add(`button--change_note`);
        const hourColor = hourColors[i].slice(1);
        $buttonChangeNote.classList.add(`color${hourColor}`);

        $buttonChangeNote.setAttribute(`id`, `button${i}`);

        $buttonChangeNote.addEventListener('click', buttonChangeNoteClicked);

        $buttonsCreateScale.appendChild($buttonChangeNote);
    }
}


//------------------------ ------------------------//
const draw = () => {
    //clear frame
    context.clearRect(0, 0, $canvas.width, $canvas.height);

    //--- hour ---//
    /*background hour*/
    let prevHourColor = previous(hour, basis.length - 1);
    context.fillStyle = hourColors[prevHourColor];
    context.fillRect(0, 0, $canvas.width, $canvas.height);

    /*hour*/
    hoursDraw.updateHour();

    //--- minutes ---//
    /*background minute*/
    let prevMinuteColor = minuteColors[previous(minute, minutesSerie.length - 1)];
    let minuteBG = createMinutesDraw(prevMinuteColor, 0);
    minuteBG.forEach(minute => {
        minute.drawMinute();
    });

    /*minute*/
    minutesDraw.forEach(minuteDraw => {
        minuteDraw.updateMinute();
    });

    //--- seconds ---//
    secondsDraw.forEach(secondDraw => {
        secondDraw.updateSecond();
    })

    requestAnimationFrame(draw);
}

const init = () => {
    $button.addEventListener('click', buttonSoundClicked);
    $slider.addEventListener('change', sliderChange);
    $buttonChange.addEventListener('click', buttonChangeClicked);

    timeNow();
    time();

    createSynths();

    basisSerie();
    noteTime();

    createButtons();

    createHour();
    createMinute();
    createSecond();

    draw();

}

init();