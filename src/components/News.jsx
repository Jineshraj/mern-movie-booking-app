import { Image as ImageIcon, Sparkle } from "lucide-react";
import { newsStyles /*newsCSS*/ } from "../assets/dummyStyles";
import { sampleNews } from "../assets/newdummydata";

const News = () => {
  return (
    <div className={newsStyles.container}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Monoton&family=Roboto:wght@300;400;700&display=swap');`}</style>
      <header className={newsStyles.header}>
        <div className={newsStyles.headerFlex}>
          <div className={newsStyles.logoContainer}>
            <div
              className={newsStyles.logoText}
              style={{ fontFamily: "'Monoton', cursive" }}
            >
              CineNews
            </div>
            <div
              className={newsStyles.logoSubtitle}
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              Latest • Curated • Cinematic
            </div>
          </div>
          <div className={newsStyles.headerButtons}>
            <button className={newsStyles.latestNewsButton}>
              <ImageIcon size={16} />
              <span className={newsStyles.buttonText}>Latest News</span>
            </button>
          </div>
        </div>
        <div className={newsStyles.heroStripe}>
          <div className={newsStyles.featuredBadge}>Featured</div>
          <div className={newsStyles.stripeText}>
            {sampleNews[0].title} -- {sampleNews[0].excerpt}
          </div>
          <div className={newsStyles.stripeIcon}>
            <Sparkle size={16} className="text-red-500" />
          </div>
        </div>
      </header>
    </div>
  );
};

export default News;
