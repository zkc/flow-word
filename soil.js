
const main = document.getElementById('main')
const input = document.getElementById('input')
const run = document.getElementById('run')
const word_display = document.getElementById('word-display')
const controls = document.getElementById('controls')
const pop = document.getElementById('pop')


const pause_button = document.getElementById('pause-button')
const slower_button = document.getElementById('slowdown')
const faster_button = document.getElementById('speedup')
const go_back_button = document.getElementById('go-back-button')
main.removeChild(word_display)
main.removeChild(controls)


input.value = `
To be, or not to be, that is the question:
Whether 'tis nobler in the mind to suffer
The slings and arrows of outrageous fortune,
Or to take arms against a sea of troubles
And by opposing end them. To die—to sleep,
No more; and by a sleep to say we end
The heart-ache and the thousand natural shocks
That flesh is heir to: 'tis a consummation
Devoutly to be wish'd. To die, to sleep;
To sleep, perchance to dream—ay, there's the rub:
For in that sleep of death what dreams may come,
When we have shuffled off this mortal coil,
Must give us pause—there's the respect
That makes calamity of so long life.
For who would bear the whips and scorns of time,
Th'oppressor's wrong, the proud man's contumely,
The pangs of dispriz'd love, the law's delay,
The insolence of office, and the spurns
That patient merit of th'unworthy takes,
When he himself might his quietus make
With a bare bodkin? Who would fardels bear,
To grunt and sweat under a weary life,
But that the dread of something after death,
The undiscovere'd country, from whose bourn
No traveller returns, puzzles the will,
And makes us rather bear those ills we have
Than fly to others that we know not of?
Thus conscience does make cowards of us all,
And thus the native hue of resolution
Is sicklied o'er with the pale cast of thought,
And enterprises of great pitch and moment
With this regard their currents turn awry
And lose the name of action.

`

const reader = {
  paused: false,
  word_index: 0,
  WPM: 200,
  get rate() {
    return ((60 / this.WPM) * 1000);
  },
  input_split: null,
  timeout_id: null,
  start(word_display, input_split) {
    this.input_split = input_split
    this.word_display = word_display
    this._changeWordAndGo()
  }, 
  _changeWordAndGo() {
    if(this.word_index < this.input_split.length) {
      this.word_display.innerText = this.input_split[this.word_index]
      this.word_index++
      this.timeout_id = setTimeout(() => this._changeWordAndGo(), this.rate)
    }
  }, 
  pause() {
    if (this.paused) {
      setTimeout(() => {
        this._changeWordAndGo()
      }, this.rate)
      this.paused = false
    } else {
      clearTimeout(this.timeout_id)
      this.paused = true      
    }
  }, 
  changeWPM(by) {
    this.WPM += by
  }
}

const showWPM = () => {
  pop.innerText = reader.WPM + ' WPM'
}

pause_button.onclick = (e) => {
  reader.pause()
}

slower_button.onclick = () => {
  reader.changeWPM(-20)
  showWPM()
}

faster_button.onclick = () => {
  reader.changeWPM(20)
  showWPM()
}

go_back_button.onclick = () => {
  !reader.paused && reader.pause()
  reader.word_index--
  reader.word_display.innerText = reader.input_split[reader.word_index]
}

run.onclick = function(e) {
  main.removeChild(input)
  main.removeChild(run)

  main.appendChild(word_display)
  main.appendChild(controls)

  const input_split = input.value.split(/[\n\s]/)

  reader.start(word_display, input_split)
  showWPM()
}



