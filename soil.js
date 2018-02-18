
const main = document.getElementById('main')
const input = document.getElementById('input')
const run = document.getElementById('run')
const word_display = document.getElementById('word-display')
const pause = document.getElementById('pause')
main.removeChild(word_display)
main.removeChild(pause)


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


class Reader {
  constructor(word_display) {
    this.state = {
      pause: false, 
      word_index: 0,
      rate: 500,
      input_split: null,
      timeout_id: null,
    }
    this.word_display = word_display
  }

  start(input_split) {
    this.state.input_split = input_split
    this.changeWordAndGo()
  }

  changeWordAndGo() {
    const { word_display, state: { input_split, rate, timeout_id, word_index }} = this
    word_display.innerText = input_split[word_index]
    this.state.word_index++
    if (word_index < input_split.length) {
      this.state.timeout_id = setTimeout(() => {
          this.changeWordAndGo()
      }, rate)
    } 
  }

  pause() {
    if (this.state.pause) {
      setTimeout(() => {
        this.changeWordAndGo()
      }, this.state.rate)
      this.state.pause = false
    } else {
      clearTimeout(this.state.timeout_id)
      this.state.pause = true      
    }
  }
}


const reader = new Reader(word_display)

pause.onclick = function(e) {
  reader.pause()
}

run.onclick = function(e) {
  main.removeChild(input)
  main.removeChild(run)

  main.appendChild(word_display)
  main.appendChild(pause)

  const input_split = input.value.split(' ')

  reader.start(input_split)
}



