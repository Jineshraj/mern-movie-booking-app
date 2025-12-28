import Banner from "../components/Banner";
import Movies from "../components/Movies";
import Navbar from "../components/Navbar";
import Trailers from "../components/Trailers";

const Home = () => {
  return (
    <>
      <Navbar></Navbar>
      <Banner></Banner>
      <Movies></Movies>
      <Trailers></Trailers>
    </>
  );
};

export default Home;
