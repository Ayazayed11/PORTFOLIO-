import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type NavItem = {
  id: string
  label: string
}

type SkillGroup = {
  title: string
  icon: string
  items: string[]
}

type Metric = {
  label: string
  value: string
}

type ContactForm = {
  name: string
  email: string
  message: string
}

const navItems: NavItem[] = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

const skills: SkillGroup[] = [
  {
    title: 'Frontend',
    icon: 'Code2',
    items: ['Angular', 'HTML', 'CSS', 'JavaScript', 'TypeScript'],
  },
  {
    title: 'Backend',
    icon: 'Server',
    items: ['.NET Core', 'REST APIs'],
  },
  {
    title: 'Database',
    icon: 'Database',
    items: ['SQL'],
  },
  {
    title: 'QA',
    icon: 'ShieldCheck',
    items: ['Cypress', 'API Testing', 'Accessibility Testing'],
  },
  {
    title: 'Soft Skills',
    icon: 'Sparkles',
    items: ['Problem Solving', 'UI/UX Design'],
  },
]

const metrics: Metric[] = [
  { label: 'Expected Graduation', value: '2026' },
  { label: 'Primary Stack', value: 'Angular + .NET Core' },
  { label: 'QA Focus', value: 'Cypress Automation' },
]

const typingText = 'Junior Quality Assurance Engineer'

const defaultForm: ContactForm = {
  name: '',
  email: '',
  message: '',
}

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = window.localStorage.getItem('aya-theme')
    return savedTheme === 'dark' ? 'dark' : 'light'
  })
  const [typedTitle, setTypedTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [form, setForm] = useState<ContactForm>(defaultForm)
  const [formStatus, setFormStatus] = useState('')
  const [activeSection, setActiveSection] = useState('top')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('aya-theme', theme)
  }, [theme])

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1100)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    let currentIndex = 0
    const interval = window.setInterval(() => {
      currentIndex += 1
      setTypedTitle(typingText.slice(0, currentIndex))

      if (currentIndex >= typingText.length) {
        window.clearInterval(interval)
      }
    }, 45)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const revealed = document.querySelectorAll<HTMLElement>('[data-reveal]')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 },
    )

    revealed.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [isLoading])

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section instanceof HTMLElement)

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id)
        }
      },
      {
        rootMargin: '-35% 0px -45% 0px',
        threshold: [0.2, 0.4, 0.65],
      },
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [isLoading])

  useEffect(() => {
    const syncMenuState = () => {
      if (window.innerWidth > 640) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', syncMenuState)
    return () => window.removeEventListener('resize', syncMenuState)
  }, [])

  const currentYear = useMemo(() => new Date().getFullYear(), [])

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    setIsMenuOpen(false)
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormStatus("Thanks for reaching out. Aya's contact details are ready for direct follow-up.")
    setForm(defaultForm)
  }

  if (isLoading) {
    return (
      <div className="loader-screen" aria-live="polite">
        <div className="loader-mark">
          <span className="loader-ring loader-ring-one"></span>
          <span className="loader-ring loader-ring-two"></span>
          <span className="loader-core">AZ</span>
        </div>
        <p>Preparing Aya&apos;s portfolio</p>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="ambient ambient-one"></div>
      <div className="ambient ambient-two"></div>

      <header className="site-header">
        <button type="button" className="brand brand-button" onClick={() => scrollToSection('top')}>
          Aya Zayed
        </button>

        <button
          type="button"
          className={`menu-toggle${isMenuOpen ? ' is-open' : ''}`}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          aria-label="Toggle navigation menu"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav
          id="primary-navigation"
          className={`top-nav${isMenuOpen ? ' is-open' : ''}`}
          aria-label="Primary"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-link${activeSection === item.id ? ' is-active' : ''}`}
              onClick={() => scrollToSection(item.id)}
              aria-current={activeSection === item.id ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
          aria-label="Toggle color theme"
        >
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </header>

      <main>
        <section id="top" className="hero-section">
          <div className="hero-copy" data-reveal>
            <span className="eyebrow">Computer Systems Engineering Student</span>
            <h1>Aya Zayed</h1>
            <p className="typing-line">
              <span>{typedTitle}</span>
              <span className="typing-caret" aria-hidden="true"></span>
            </p>
            <p className="hero-summary">
              Computer Systems Engineering student with hands-on experience in Angular, .NET
              Core, SQL, and QA automation using Cypress. Passionate about building
              user-friendly applications and improving software quality.
            </p>

            <div className="hero-actions">
              <button type="button" className="primary-button" onClick={() => scrollToSection('projects')}>
                View Projects
              </button>
              <button type="button" className="secondary-button" onClick={() => scrollToSection('contact')}>
                Contact Me
              </button>
              <a className="ghost-button" href="/Aya-Zayed-CV.pdf" download>
                Download CV
              </a>
            </div>

            <div className="hero-metrics">
              {metrics.map((metric) => (
                <article className="metric-card" key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="hero-visual" data-reveal>
            <div className="portrait-frame">
              <div className="portrait-glow"></div>
              <img src="/aya-zayed.jpg" alt="Aya Zayed portrait" />
            </div>
            <div className="floating-note note-top">
              <span>QA Automation</span>
              <strong>Cypress and API testing</strong>
            </div>
            <div className="floating-note note-bottom">
              <span>Quality Focus</span>
              <strong>Accessibility and reliable delivery</strong>
            </div>
          </div>
        </section>

        <section id="about" className="content-section" data-reveal>
          <SectionHeading
            eyebrow="About Me"
            title="Engineering, development, and product quality in one path."
            description="Aya brings a balanced profile that blends software implementation, UI thinking, and quality assurance."
          />

          <div className="about-grid">
            <article className="about-card">
              <p>
                Aya is a Computer Systems Engineering student expected to graduate in 2026,
                building real-world experience in full-stack development with Angular, .NET
                Core, and SQL. She enjoys shaping interfaces that feel intuitive, then making
                sure they hold up through solid QA practices.
              </p>
            </article>
            <article className="about-card highlight-card">
              <p>
                Alongside technical growth, she has taken part in IEEE activities and
                competitions, which strengthened her teamwork, problem solving, and ability to
                learn quickly in collaborative environments.
              </p>
            </article>
          </div>
        </section>

        <section id="skills" className="content-section" data-reveal>
          <SectionHeading
            eyebrow="Skills"
            title="A practical toolkit for shipping and testing software."
            description="From interface work to API integration and QA automation, the stack reflects both builder and tester instincts."
          />

          <div className="skills-grid">
            {skills.map((skillGroup) => (
              <article className="skill-card" key={skillGroup.title}>
                <div className="skill-heading">
                  <IconBadge icon={skillGroup.icon} />
                  <h3>{skillGroup.title}</h3>
                </div>
                <div className="skill-tags">
                  {skillGroup.items.map((item) => (
                    <span className="skill-tag" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className="content-section" data-reveal>
          <SectionHeading
            eyebrow="Experience"
            title="Hands-on training with real full-stack and QA workflows."
            description="A focused trainee experience that connected development, databases, APIs, interface design, and automated testing."
          />

          <article className="timeline-card">
            <div className="timeline-header">
              <div>
                <h3>Full-Stack Development Trainee</h3>
                <p>IConnect Technologies</p>
              </div>
              <span>Ramallah | 2025</span>
            </div>
            <div className="timeline-points">
              <p>Worked on full-stack web development in a structured training environment.</p>
              <p>Built a Task Management System using Angular and .NET Core.</p>
              <p>Learned REST APIs, SQL workflows, and UI/UX fundamentals.</p>
              <p>Trained in QA automation using Cypress for stronger software quality.</p>
            </div>
          </article>
        </section>

        <section id="projects" className="content-section" data-reveal>
          <SectionHeading
            eyebrow="Projects"
            title="A portfolio centerpiece grounded in real implementation."
            description="The featured project highlights Aya's ability to connect frontend, backend, database, and testing concerns into one coherent product."
          />

          <article className="project-card">
            <div className="project-copy">
              <span className="project-label">Featured Project</span>
              <h3>Task Management System</h3>
              <p>
                A full-stack web application for managing tasks, built using Angular and .NET
                Core with REST APIs and a SQL database. The project reflects both application
                structure and a quality-focused mindset.
              </p>
              <div className="project-meta">
                <span>Angular</span>
                <span>.NET Core</span>
                <span>REST APIs</span>
                <span>SQL</span>
              </div>
            </div>

            <div className="project-actions">
              <a
                className="primary-button"
                href="https://github.com/Ayazayed11/iConnectProject.git"
                target="_blank"
                rel="noreferrer"
              >
                View on GitHub
              </a>
            </div>
          </article>
        </section>

        <section id="contact" className="content-section" data-reveal>
          <SectionHeading
            eyebrow="Contact"
            title="Open to internships, junior roles, and meaningful collaboration."
            description="The portfolio is designed to make direct outreach easy for recruiters, teams, and mentors."
          />

          <div className="contact-grid">
            <div className="contact-card">
              <a href="mailto:ayazayed123987@gmail.com">ayazayed123987@gmail.com</a>
              <a href="tel:+970598476061">+970598476061</a>
              <p>Palestine</p>
              <a
                href="https://www.linkedin.com/in/aya-zayed-983b75258/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn Profile
              </a>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <label>
                <span>Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Your name"
                  required
                />
              </label>

              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="your@email.com"
                  required
                />
              </label>

              <label>
                <span>Message</span>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, message: event.target.value }))
                  }
                  placeholder="Tell Aya a little about the opportunity."
                  required
                ></textarea>
              </label>

              <button type="submit" className="primary-button">
                Send Message
              </button>

              {formStatus ? <p className="form-status">{formStatus}</p> : null}
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>{currentYear} Aya Zayed. Built to showcase development and QA strengths.</p>
      </footer>
    </div>
  )
}

type SectionHeadingProps = {
  eyebrow: string
  title: string
  description: string
}

function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

type IconBadgeProps = {
  icon: string
}

function IconBadge({ icon }: IconBadgeProps) {
  const path = iconPaths[icon] ?? iconPaths.Code2

  return (
    <span className="icon-badge" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d={path}></path>
      </svg>
    </span>
  )
}

const iconPaths: Record<string, string> = {
  Code2:
    'M8 8 4 12l4 4M16 8l4 4-4 4M14 4l-4 16',
  Server:
    'M4 6.5h16M4 12h16M4 17.5h16M6.5 4h11A1.5 1.5 0 0 1 19 5.5v2A1.5 1.5 0 0 1 17.5 9h-11A1.5 1.5 0 0 1 5 7.5v-2A1.5 1.5 0 0 1 6.5 4Zm0 5.5h11A1.5 1.5 0 0 1 19 11v2a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 13v-2a1.5 1.5 0 0 1 1.5-1.5Zm0 5.5h11A1.5 1.5 0 0 1 19 16.5v2a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 18.5v-2A1.5 1.5 0 0 1 6.5 15Z',
  Database:
    'M12 5c4.418 0 8 1.567 8 3.5S16.418 12 12 12 4 10.433 4 8.5 7.582 5 12 5Zm8 8c0 1.933-3.582 3.5-8 3.5S4 14.933 4 13M20 17.5c0 1.933-3.582 3.5-8 3.5S4 19.433 4 17.5',
  ShieldCheck:
    'M12 3l7 3v5c0 4.5-2.85 8.69-7 10-4.15-1.31-7-5.5-7-10V6l7-3Zm-3 9 2 2 4-4',
  Sparkles:
    'm12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3L12 3Zm6 11 .75 2.25L21 17l-2.25.75L18 20l-.75-2.25L15 17l2.25-.75L18 14ZM6 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z',
}

export default App
