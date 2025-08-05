import "./Home.css";
import Navbar from "../../components/Navbar/NavBar";

export default function Home() {
  return (
    <div className="home">
       <Navbar />
      <div className="background-container">
       
        <img
          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/moon2.png"
          alt="moon"
        />
        <div className="stars"></div>
        <div className="twinkling"></div>
        <div className="clouds"></div>

        <div className="home-content">
          <h2>Welcome to NASA Image Explorer</h2>
          <p>Explore stunning images from NASA’s archives</p>
          <div className="search-glass">
            <input
              type="text"
              placeholder="Search for planets, stars, galaxies..."
              className="search-input"
            />
            <button className="search-button">→</button>
          </div>
        </div>
      </div>
    </div>
  );
}
