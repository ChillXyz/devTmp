import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const projects = [
  {
    number: '01/',
    title: '$FROQ',
    image: '/src/assets/images/froqoionspond-announcement.png',
    link: '/froq',
    highlight: 'FROQ'
  },
  {
    number: '02/',
    title: 'Froqorion\'s Quest',
    image: '/src/assets/images/froqoionspond-announcement.png',
    link: '/quest',
    highlight: 'Froqorion\'s'
  },
  {
    number: '03/',
    title: 'Islands of Sonic',
    image: '/src/assets/images/froqoionspond-announcement.png',
    link: '/islands',
    highlight: 'Sonic'
  },
  {
    number: '04/',
    title: 'SonicFrogs',
    image: '/src/assets/images/froqoionspond-announcement.png',
    link: '/sonicfrogs',
    highlight: 'Frogs'
  },
  {
    number: '05/',
    title: 'Froggle\'s Rumble',
    image: '/src/assets/images/froqoionspond-announcement.png',
    link: '/froggle',
    highlight: 'Froggle\'s'
  }
];

const Projects: React.FC = () => {
  const projectRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-visible', 'true');
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px'
      }
    );

    projectRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      projectRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const renderProjectTitle = (project: typeof projects[0]) => {
    const parts = project.title.split(project.highlight);
    return (
      <>
        <span className="project-number">{project.number}</span>
        <h2 className="project-title">
          {parts.map((part, i) => (
            <React.Fragment key={i}>
              {part}
              {i < parts.length - 1 && <span className="text-green">{project.highlight}</span>}
            </React.Fragment>
          ))}
        </h2>
      </>
    );
  };

  return (
    <section className="projects-section">
      <div className="subtitle">Projects</div>
      <div className="projects-container">
        {projects.map((project, index) => (
          <Link 
            key={index}
            to={project.link} 
            className="project-item"
            data-visible="false"
            data-active={activeIndex === index}
            ref={el => projectRefs.current[index] = el}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div className="project-content">
              {renderProjectTitle(project)}
            </div>
            <div className="project-image-wrapper">
              <img 
                src={project.image}
                alt={project.title}
                className="project-image"
                loading="lazy"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Projects;
