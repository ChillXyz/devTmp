import Navbar from '../components/Navbar';
import logo from '../assets/images/logowithoutbg.svg';
import vector1 from '../assets/images/Vector-1.svg';
import vector2 from '../assets/images/Vector-2.svg';
import vector from '../assets/images/Vector.svg';
import group412 from '../assets/images/Group-412.svg';
import froqIsland from '../assets/images/froqoionspond-announcement.png';
import froqToken from '../assets/images/froq.png';
import froqRumble from '../assets/images/froqRumble.png';
import froqQuest from '../assets/images/froqQuest.png';
import sonicFrogs from '../assets/images/sonicFrogs.png';

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="section-header">
        <div>
          <div className="container-header">
            <h1 className="display">
              Welcome to <span className="green">Froqorion </span>- a{' '}
              <span className="sonic clipped">Sonic </span>
              based NFT game studio dedicated to making web3 fun -{' '}
              <span className="green">frog </span>style!
            </h1>
          </div>
        </div>
      </div>
      <div className="section-projects">
        <div>
          <div className="container-projects">
            <div className="subtitle">Projects</div>
            <div className="w-layout-vflex flex-block-3">
              <div data-w-id="82128bff-5dfe-fe52-6dea-c886c5745bf7" className="w-layout-hflex flex-block-2">
                <div className="subtitle">01 / </div>
                <h2 className="h2-projects">$<span className="green">FROQ</span></h2>
                <img src={froqToken} loading="lazy" data-w-id="82666110-ebcf-aada-4507-1c5e708b73be" alt="" className="image-3" />
              </div>
              <div data-w-id="87956678-5581-0408-4706-4b4501bb055c" className="w-layout-hflex flex-block-2">
                <div className="subtitle">02 / </div>
                <h2 className="h2-projects"><span className="green">Froqorion's </span>Quest</h2>
                <img src={froqQuest} loading="lazy" data-w-id="87956678-5581-0408-4706-4b4501bb0561" alt="" className="image-3" />
              </div>
              <div data-w-id="7356a878-1cbe-5307-aa16-e973f940ae9c" className="w-layout-hflex flex-block-2">
                <div className="subtitle">03 / </div>
                <h2 className="h2-projects">Islands of <span className="green">Sonic</span></h2>
                <img src={froqIsland} loading="lazy" data-w-id="7356a878-1cbe-5307-aa16-e973f940aea1" alt="" className="image-3" />
              </div>
              <div data-w-id="db3c64dd-7099-6ca6-61b5-fdeaa2d9f4fa" className="w-layout-hflex flex-block-2">
                <div className="subtitle">04 / </div>
                <h2 className="h2-projects">Sonic<span className="green">Frogs</span></h2>
                <img src={sonicFrogs} loading="lazy" data-w-id="db3c64dd-7099-6ca6-61b5-fdeaa2d9f4ff" alt="" className="image-3" />
              </div>
              <div data-w-id="c7d6bc97-18c8-b59e-edb2-8adabf80a4d0" className="w-layout-hflex flex-block-2">
                <div className="subtitle">05 / </div>
                <h2 className="h2-projects"><span className="green">Froggle's </span>Rumble</h2>
                <img src={froqRumble} loading="lazy" data-w-id="c7d6bc97-18c8-b59e-edb2-8adabf80a4d5" alt="" className="image-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section-universe">
        <div>
          <div className="container-universe">
            <img src={group412} loading="lazy" alt="" className="image-6" />
          </div>
        </div>
      </div>
      <div className="section-contact">
        <div>
          <div className="container-contact">
            <div className="w-layout-vflex flex-block-4">
              <a href="https://discord.gg/cKxhykX5Yu" className="link-block-2 w-inline-block">
                <img src={vector2} loading="lazy" alt="" className="image-5" />
              </a>
              <a href="https://x.com/Froqorion" className="link-block-2 w-inline-block">
                <img src={vector} loading="lazy" alt="" className="image-5" />
              </a>
              <a href="https://t.me/froqorionportal" className="link-block-2 w-inline-block">
                <img src={vector1} loading="lazy" alt="" className="image-5" />
              </a>
            </div>
            <img src={logo} loading="lazy" alt="" className="image" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
