import { useState } from 'react'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return

    try {
      const response = await fetch(
        `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`
      )
      const data = await response.json()
      const items = data.collection.items || []
      setResults(items)
    } catch (error) {
      console.error('Search failed:', error)
    }
  }

  return (
    <div>
      <h2>NASA Image Search</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search space stuff..."
        />
        <button type="submit">Search</button>
      </form>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {results.map((item, idx) => {
          const img = item.links?.[0]?.href
          const title = item.data?.[0]?.title
          return (
            <div key={idx} style={{ width: 200, margin: 10 }}>
              <img src={img} alt={title} style={{ width: '100%' }} />
              <p>{title}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
