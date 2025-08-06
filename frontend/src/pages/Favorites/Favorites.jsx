import NavBar from "../../components/Navbar/NavBar";
import "./Favorites.css";

export default function Favorites() {
  // Temporary data
  const favorites = [
    {
      title: "The Pillars of Creation",
      img: "https://images-assets.nasa.gov/image/PIA01320/PIA01320~thumb.jpg",
    },
    {
      title: "Jupiter Storms",
      img: "https://images-assets.nasa.gov/image/PIA21974/PIA21974~thumb.jpg",
    },
    {
      title: "Mars Surface",
      img: "https://images-assets.nasa.gov/image/PIA00407/PIA00407~thumb.jpg",
    },
  ];

  return (
    <div className="favorites-page">
      <div className="favorites-background"></div>
      <NavBar />
      <div className="favorites-content">
        <h2 className="favorites-title">Your Favorite Images</h2>
        <p className="favorites-description">
          A collection of NASA images you’ve saved. Click to view or download.
        </p>
      </div>
      <div className="favorites-grid">
        {favorites.map((item, idx) => (
          <div className="favorites-card" key={idx}>
            <div className="icon-bar">
              <div className="icon-wrapper">
                <i
                  className="fa-solid fa-arrow-down"
                  onClick={() => window.open(item.img, "_blank")}
                ></i>
                <span className="icon-label">Download</span>
              </div>
              <div className="icon-wrapper">
                <i className="fa-solid fa-trash-can"></i>
                <span className="icon-label">Delete</span>
              </div>
            </div>
            <img src={item.img} alt={item.title} />
            <p className="img-title">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
