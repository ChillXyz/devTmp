import socialIcon1 from '../assets/images/Vector-2.svg';
import socialIcon2 from '../assets/images/Vector.svg';
import socialIcon3 from '../assets/images/Vector-1.svg';
import logo from '../assets/images/logowithoutbg.svg';

interface SocialLink {
  icon: string;
  url: string;
  alt: string;
}

const Contact = () => {
  const socialLinks: SocialLink[] = [
    { icon: socialIcon1, url: '#', alt: 'Discord' },
    { icon: socialIcon2, url: '#', alt: 'Twitter' },
    { icon: socialIcon3, url: '#', alt: 'Telegram' }
  ];

  return (
    <section className="section-contact">
      <div className="container-contact">
        <div className="social-links">
          {socialLinks.map((link, index) => (
            <a 
              key={index} 
              href={link.url} 
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img 
                src={link.icon} 
                alt={link.alt} 
                className="social-icon" 
              />
            </a>
          ))}
        </div>
        <img 
          src={logo} 
          alt="Froqorion Logo" 
          className="footer-logo" 
        />
      </div>
    </section>
  );
};

export default Contact;
