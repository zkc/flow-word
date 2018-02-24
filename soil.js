
const main = document.getElementById('main')
const input = document.getElementById('input')
const run = document.getElementById('run')
const word_display = document.getElementById('word-display')
const controls = document.getElementById('controls')
const pop = document.getElementById('pop')


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
  WPM: 400,
  get rate() {
    if (this.breath) {
      this.breath = false
      return ((60 / (this.WPM * this.breath_percent)) * 1000);
    } else {
      return ((60 / this.WPM) * 1000);
    }
  },
  input_split: null,
  timeout_id: null,
  words_view: null,
  breath_regex: RegExp('[,\.;:?!]'),
  breath_percent: 0.5,
  breath: false, 
  start(word_display, input_split) {
    this.input_split = input_split
    this.word_display = word_display
    this.changeWPM(0)
    this._changeWordAndGo()
  }, 
  _changeWordAndGo() {
    if(this.word_index < this.input_split.length) {
      const nextWord = this.input_split[this.word_index]
      
      this.word_display.innerText = nextWord
      this.word_index++
      this.breath = nextWord.match(this.breath_regex)
      this.timeout_id = setTimeout(() => this._changeWordAndGo(), this.rate)
    }
  }, 
  pause() {
    if (this.paused) {
      setTimeout(() => {
        this._changeWordAndGo()
      }, this.rate)
      this.paused = false
      this.unExpandView()
    } else {
      clearTimeout(this.timeout_id)
      this.paused = true
      this.expandView()
    }
  }, 
  changeWPM(by) {
    this.WPM += by
    pop.innerText = reader.WPM + ' WPM'
  },
  goTo({ isDelta, number }) {
    if (isDelta) {
      this.word_index += number
    } else {
      this.word_index = number
    } 
    this.word_display.innerText = this.input_split[this.word_index-1]
    this.expandView()
  }, 
  expandView() {
    if (!this.words_view) {
      this.words_view = document.createElement('div')
      this.words_view.id = 'words_view'
    } else {
      while (this.words_view.firstChild) {
        this.words_view.removeChild(this.words_view.firstChild)
      }
    }
    for (let i = this.word_index-6; i < this.word_index; i++) { //could allow future words too
      const wordEle = document.createElement('div')
      wordEle.className = "word-viewbox"
      wordEle.innerText = this.input_split[i]
      wordEle.setAttribute('word_index', i+1) 
      this.words_view.appendChild(wordEle)
    }
    this.word_display.appendChild(this.words_view)
  },
  unExpandView() {
    this.word_display.removeChild(this.words_view)
  }
}


document.onclick = (e) => {
  switch (e.target.id || e.target.parentNode.id) {
    case 'pause-button':
      reader.pause()
      break

    case 'slowdown':
      reader.changeWPM(-e.target.getAttribute('amount')*1)
      break

    case 'speedup':
      reader.changeWPM(e.target.getAttribute('amount')*1)
      break

    case 'go-back-button':
      !reader.paused && reader.pause()
      reader.goTo({ isDelta:true, number:-1 })
      break

    case 'run':
      input.style.display = 'none'
      run.style.display = 'none'
      word_display.style.display = 'grid'
      controls.style.display = 'grid'
    
      const input_split = input.value.split(/[\n\s]/)
      reader.start(word_display, input_split)
      break
    
    case 'words_view':
      const index = e.target.getAttribute('word_index')*1
      index && reader.goTo({ number: index })
      break

    default:
      console.log(e, e.target.id, 'unknown id case')
      break
  }
}
