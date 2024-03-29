import { useState, useEffect } from "react"

const App = () => {
  const [ value, setValue ] = useState(null)
  const [ message, setMessage ] = useState(null)
  const [ prevChats, setPrevChats] = useState([])
  const [ currentTitle, setCurrentTitle ] = useState(null)

  const createNewChat = async() => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (title) => {
    setCurrentTitle(title)
    setMessage(null)
    setValue("")
  }

  const getMessages = async() => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type": "application/json",
      }
    }
    try {
      const response = await fetch('http://localhost:8000/completions', options)
      const data = await response.json()
      setMessage(data.choices[0].message)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log(currentTitle, value, message)
    if (!currentTitle && value && message) {
      setCurrentTitle(value)
    }
    if (currentTitle && value && message) {
      setPrevChats(prevChats => (
        [...prevChats, {
          title: currentTitle, 
          role: "user",
          content: value,
        }, {
          title: currentTitle,
          role: message.role,
          content: message.content,
        }]
      ))
    }
  }, [message, currentTitle])

  console.log(prevChats)

  const currChat = prevChats.filter(prevChat => prevChat.title === currentTitle)
  const uniqueTitles = Array.from(new Set(prevChats.map(prevChat => prevChat.title)))
  console.log(uniqueTitles)

  return (
    <div className = "app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => <li key="index" onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made By <a href="https://github.com/gdev-kingx">@gdev._king.x</a></p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>CodeGPT</h1>}
        <ul className="feed">
          {currChat?.map((chatMess, i) => <li key={i}>
            <p className="role">{chatMess.role}</p>
            <p>{chatMess.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
              <input value={value} onChange={(e) => setValue(e.target.value)}/>
              <div id="submit" onClick={getMessages}>➢</div>
          </div>
          <p className="info">
            Chat GPT Mar 14 Version. Free Research Preview.
            Our goal is to make AI systems more natural and safe to interact with.
            Your feedback will help us improve.
          </p>
        </div>
      </section>
    </div>
  )
}

export default App