import { useState, useEffect } from 'react'
import './App.css'

// Alphabet arranged in 3 rows like the show
const ALPHABET_ROWS = [
  'ABCDEFGH',
  'IJKLMNOPQ',
  'RSTUVWXYZ'
]

function App() {
  const [message, setMessage] = useState('')
  const [currentMessage, setCurrentMessage] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFlickeringAll, setIsFlickeringAll] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [copyButtonText, setCopyButtonText] = useState('Copy')

  const [layoutParams, setLayoutParams] = useState({
    letterWidth: 50,
    gap: 45
  })

  // Read URL parameter on mount
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth
      if (width < 480) {
        setLayoutParams({ letterWidth: 28, gap: 15 })
      } else if (width < 768) {
        setLayoutParams({ letterWidth: 40, gap: 30 })
      } else {
        setLayoutParams({ letterWidth: 50, gap: 45 })
      }
    }

    // Initial check
    updateLayout()

    // Listen for resize
    window.addEventListener('resize', updateLayout)
    return () => window.removeEventListener('resize', updateLayout)
  }, [])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const msgFromUrl = urlParams.get('msg')

    if (msgFromUrl) {
      let decodedMsg = msgFromUrl
      try {
        // Try to decode assuming it's base64
        decodedMsg = atob(msgFromUrl)
      } catch (e) {
        // If failed, it might be a legacy plain text link, use as is
        console.log('Failed to decode msg, using as plain text')
      }

      const cleanedMsg = decodedMsg.toUpperCase().replace(/[^A-Z]/g, '')
      if (cleanedMsg) {
        setCurrentMessage(cleanedMsg)
        // Small delay on initial load before playing
        setTimeout(() => playMessage(cleanedMsg), 1000)
      }
    }
  }, [])

  // Generate share URL whenever currentMessage changes
  useEffect(() => {
    if (currentMessage) {
      const encodedMsg = btoa(currentMessage)
      const url = `${window.location.origin}${window.location.pathname}?msg=${encodeURIComponent(encodedMsg)}`
      setShareUrl(url)
    } else {
      setShareUrl('')
    }
  }, [currentMessage])

  const playMessage = async (msg: string) => {
    if (!msg || isPlaying) return

    setIsPlaying(true)

    // 1. Initial crazy flickering (3.0s)
    setIsFlickeringAll(true)
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsFlickeringAll(false)
    await new Promise(resolve => setTimeout(resolve, 500)) // Pause before msg

    // 2. Play the message
    const letters = msg.split('')

    for (let i = 0; i < letters.length; i++) {
      const letter = letters[i]
      if (/[A-Z]/.test(letter)) {
        setActiveLetter(letter)
        await new Promise(resolve => setTimeout(resolve, 800))
        setActiveLetter(null)
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }

    // 3. Final crazy flickering (3.0s)
    await new Promise(resolve => setTimeout(resolve, 500)) // Pause after msg
    setIsFlickeringAll(true)
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsFlickeringAll(false)

    setIsPlaying(false)
  }

  const handleDisplayMessage = () => {
    // Clean message: only letters, convert to uppercase
    const cleanedMsg = message.toUpperCase().replace(/[^A-Z]/g, '')

    if (!cleanedMsg) {
      alert('Please enter a valid message with letters!')
      return
    }

    setCurrentMessage(cleanedMsg)

    // Update URL without reload
    const encodedMsg = btoa(cleanedMsg)
    const url = `${window.location.pathname}?msg=${encodeURIComponent(encodedMsg)}`
    window.history.pushState({}, '', url)

    playMessage(cleanedMsg)
  }

  const handleCopyUrl = async () => {
    if (!shareUrl) return

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopyButtonText('Copied!')
      setTimeout(() => setCopyButtonText('Copy'), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isPlaying) {
      handleDisplayMessage()
    }
  }

  return (
    <div className="app-container">
      {/* Wooden wall background */}
      <div className="wall-background"></div>


      {/* Main alphabet wall */}
      <div className="alphabet-wall">
        <h1 className="wall-title z-100">VECNA LIVES</h1>


        {ALPHABET_ROWS.map((row, rowIndex) => {
          const letterCount = row.length
          const { letterWidth, gap } = layoutParams
          const totalWidth = letterCount * letterWidth + (letterCount - 1) * gap
          const startX = letterWidth / 2

          // Generate wire path for this row
          let pathD = `M ${startX} 0`
          for (let i = 0; i < letterCount - 1; i++) {
            const currentX = startX + i * (letterWidth + gap)
            const nextX = startX + (i + 1) * (letterWidth + gap)
            const midX = (currentX + nextX) / 2
            // Alternating dip for realism
            const dip = 20 + (i % 3) * 5

            pathD += ` Q ${midX} ${dip} ${nextX} 0`
          }

          return (
            <div key={rowIndex} className="letter-row" style={{ gap: `${gap}px` }}>
              {/* Per-row wire SVG */}
              <svg
                className="row-wire-svg"
                viewBox={`0 -5 ${totalWidth} 40`}
                preserveAspectRatio="none"
                style={{ width: `${totalWidth}px` }}
              >
                <path className="wire-path" d={pathD} />
              </svg>

              {row.split('').map((letter) => (
                <div
                  key={letter}
                  className={`letter ${activeLetter === letter ? 'active' : ''} ${isFlickeringAll ? 'flickering-all' : ''}`}
                  data-letter={letter}
                  style={{ width: `${letterWidth}px` }}
                >
                  <div className="letter-bulb-socket"></div>
                  <div className="letter-wire"></div>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Message input section */}
      <div className="message-input  ">
        <div className="input-group">
          <input
            type="text"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isPlaying}
          />
          <button
            onClick={handleDisplayMessage}
            disabled={isPlaying || !message.trim()}
          >
            {isPlaying ? 'Playing...' : 'Display Message'}
          </button>


          {shareUrl && (
            <button
              className={` h-full ${copyButtonText === 'Copied!' ? 'copied' : ''}`}
              onClick={handleCopyUrl}
            >
              {copyButtonText === 'Copied!' ? '✓ Link Copied!' : 'Copy Link'}
            </button>
          )} </div>
      </div>
      <a
        href="https://github.com/jitendraSingh23/Stranger-Things.git"
        target="_blank"
        rel="noopener noreferrer"
        className="github-float"
        aria-label="View Source on GitHub"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      </a>
    </div>

  )
}

export default App
