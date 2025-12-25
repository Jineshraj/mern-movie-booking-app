import { bannerStyles } from "../assets/dummyStyles";
import { Link } from "react-router-dom";
import Video from "../assets/MovieBannerVideo.mp4";
import { Info, Star, Ticket } from "lucide-react";

const Banner = () => {
  return (
    <div className={bannerStyles.container}>
      <div className={bannerStyles.videoContainer}>
        <video autoPlay muted loop playsInline className={bannerStyles.video}>
          <source src={Video} type="video/mp4" />
          {/* FALL BACK TEXT */}
          Your Browser is not being able to play this Video.
        </video>
        <div className={bannerStyles.overlay}></div>
      </div>
      <div className={bannerStyles.content}>
        <div className={bannerStyles.contentInner}>
          <h1
            className={bannerStyles.title}
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Oceans Legacy
          </h1>
          <p className={bannerStyles.description}>
            An epic adventure beneath the waves. Explore the mysteries of the
            deep ocean and discover the treasures beyond imagination in the
            breathtaking cinematic experience.
          </p>
          <div className={bannerStyles.ratingGenreContainer}>
            <div className={bannerStyles.ratingContainer}>
              <div className={bannerStyles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={bannerStyles.star}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className={bannerStyles.ratingText}>4.8/5</span>
            </div>
            <div className={bannerStyles.genreText}>
              Adventure • Fantasy • Drama
            </div>
          </div>
          <div className={bannerStyles.buttonsContainer}>
            <a href="/movies" className={bannerStyles.bookButton}>
              <Ticket className={bannerStyles.icon} fill="white" />
              Book Movie
            </a>
            <a href="/contact" className={bannerStyles.infoButton}>
              <Info className={bannerStyles.icon} />
              More Info
            </a>
          </div>
        </div>
      </div>
      <style>{bannerStyles.customCSS}</style>
    </div>
  );
};

export default Banner;
