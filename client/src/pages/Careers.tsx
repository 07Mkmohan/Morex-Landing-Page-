const Careers = () => {
  const jobs = [
    {
      title: 'Senior Backend Engineer',
      location: 'Remote',
      type: 'Full-time',
      description: 'Build scalable backend systems for paint manufacturers. Work with TypeScript, Node.js, and PostgreSQL.',
      skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'API Design'],
    },
    {
      title: 'Full Stack Engineer',
      location: 'Remote',
      type: 'Full-time',
      description: 'Create beautiful and functional interfaces for factory owners. Work with React and modern web technologies.',
      skills: ['React', 'TypeScript', 'CSS', 'Node.js'],
    },
    {
      title: 'Product Manager',
      location: 'India',
      type: 'Full-time',
      description: 'Drive product strategy for paint manufacturing ERP. Work directly with paint factory owners to understand their needs.',
      skills: ['SaaS', 'Paint Industry', 'Product Strategy', 'User Research'],
    },
    {
      title: 'Customer Success Manager',
      location: 'Remote',
      type: 'Full-time',
      description: 'Help paint factories get the most value from PaintOS. Be their advocate and ensure their success.',
      skills: ['Customer Success', 'SaaS', 'Communication', 'Paint Industry'],
    },
  ];

  return (
    <div className="content-page">
      <div className="page-hero">
        <div className="hero-content">
          <div className="badge">Join Us</div>
          <h1>Help Us Transform Paint Manufacturing</h1>
          <p className="lede">
            We're building the future of paint manufacturing software. Join our team and make a real impact on how factories operate.
          </p>
        </div>
      </div>

      <section className="panel glass">
        <div className="panel-header">
          <h2>Why Work at PaintOS?</h2>
        </div>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🎯</div>
            <h3>Meaningful Work</h3>
            <p>Build products that directly impact real businesses. See your work making a difference.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🚀</div>
            <h3>Fast Growing</h3>
            <p>Join a fast-growing startup with huge market potential in paint manufacturing.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">💡</div>
            <h3>Innovation</h3>
            <p>Work on cutting-edge technology solving real industry problems.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🤝</div>
            <h3>Great Culture</h3>
            <p>Collaborate with smart, passionate people who care about the product.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">📈</div>
            <h3>Growth</h3>
            <p>Invest in yourself with learning opportunities and career development.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🌍</div>
            <h3>Flexible</h3>
            <p>Remote-first culture with flexible work arrangements and great work-life balance.</p>
          </div>
        </div>
      </section>

      <section className="panel glass">
        <div className="panel-header">
          <h2>Open Positions</h2>
          <p>We're hiring talented people to help paint manufacturers run smarter operations.</p>
        </div>
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job.title} className="job-card">
              <div className="job-header">
                <h3>{job.title}</h3>
                <div className="job-meta">
                  <span className="job-location">📍 {job.location}</span>
                  <span className="job-type">{job.type}</span>
                </div>
              </div>
              <p className="job-description">{job.description}</p>
              <div className="job-skills">
                {job.skills.map((skill) => (
                  <span key={skill} className="skill-badge">
                    {skill}
                  </span>
                ))}
              </div>
              <a href="mailto:careers@paintos.com" className="job-cta">
                View Job Details →
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="panel glass">
        <div className="panel-header">
          <h2>Our Culture</h2>
        </div>
        <div className="about-content">
          <p>
            At PaintOS, we believe that great products come from great teams. We're building a culture of:
          </p>
          <ul className="about-list">
            <li>✅ Ownership - You own your projects and drive them to success</li>
            <li>✅ Transparency - Open communication and clear goals</li>
            <li>✅ Excellence - We aim for high quality in everything we do</li>
            <li>✅ Collaboration - We succeed together, not individually</li>
            <li>✅ Continuous Learning - Always improving and growing</li>
            <li>✅ Customer Obsession - Everything we do is for our customers</li>
          </ul>
        </div>
      </section>

      <section className="panel glass">
        <div className="panel-header">
          <h2>Don't See Your Role?</h2>
        </div>
        <div className="about-content">
          <p>
            We're always looking for talented people. If you're interested in joining PaintOS and don't see a perfect fit, send us your resume and tell us about yourself.
          </p>
          <p>We'd love to hear from you at <strong>careers@paintos.com</strong></p>
        </div>
      </section>

      <section className="panel cta-section">
        <div className="cta">
          <div>
            <h2>Ready to Make an Impact?</h2>
            <p>
              Join the PaintOS team and help transform how paint manufacturers operate.
            </p>
          </div>
          <div className="cta-actions">
            <a href="mailto:careers@paintos.com" className="btn primary">
              Get In Touch
            </a>
            <span className="hint">careers@paintos.com</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
