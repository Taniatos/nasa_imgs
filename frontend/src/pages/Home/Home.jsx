import { useEffect, useState } from 'react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import './Home.css'

export default function Home() {
  const [images, setImages] = useState([])

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch('https://images-api.nasa.gov/search?q=planet&media_type=image')
        const data = await res.json()
        const items = data.collection.items.slice(0, 10)

        // Map through results and get high-res URLs
        const highResImages = await Promise.all(
          items.map(async item => {
            const nasaId = item.data[0].nasa_id
            const title = item.data[0].title || 'NASA Image'

            // Fetch high-res asset links
            const assetRes = await fetch(`https://images-api.nasa.gov/asset/${nasaId}`)
            const assetData = await assetRes.json()
            const assetItems = assetData.collection.items

            // Try to find 'orig.jpg' or the best fallback
            const highResItem =
              assetItems.find(i => i.href.endsWith('orig.jpg')) ||
              assetItems.find(i => i.href.endsWith('large.jpg')) ||
              assetItems[0]

            return {
              url: highResItem?.href,
              title,
            }
          })
        )

        setImages(highResImages.filter(img => !!img.url))
      } catch (err) {
        console.error('Error loading NASA images:', err)
      }
    }

    fetchImages()
  }, [])

  return (
    <div className="home">
      <h2>Welcome to NASA Image Explorer</h2>
      <p>Explore stunning images from NASA’s archives</p>

      <div className="carousel-container">
        <Carousel
          autoPlay
          interval={4000}
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          stopOnHover={false}
          swipeable={true}
          emulateTouch={true}
        >
          {images.map((img, idx) => (
            <div key={idx}>
              <img src={img.url} alt={img.title} />
              <p className="legend">{img.title}</p>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  )
}
