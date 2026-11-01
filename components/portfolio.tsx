"use client";

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { content, type Project } from "@/data/content";

type ContributionDay = { contributionCount: number; date: string; weekday: number };
type ContributionsResponse = {
  configured: boolean;
  totalContributions?: number;
  weeks?: { contributionDays: ContributionDay[] }[];
  stats?: { busiestDay: string; longestStreak: number; recentShare: number };
  error?: string;
};

const navigation = [
  { id: "work", label: "Work" },
  { id: "commits", label: "Commits" },
  { id: "story", label: "Story" },
  { id: "approach", label: "Approach" },
  { id: "contact", label: "Contact" },
];

function SheetLabel({ number, total, title }: { number: number; total: number; title: string }) {
  return <div className="sheet-label">Sheet {String(number).padStart(2, "0")} of {String(total).padStart(2, "0")} — {title}</div>;
}

function StampButton({ children, onClick, href, filled = false }: { children: ReactNode; onClick?: () => void; href?: string; filled?: boolean }) {
  const className = `stamp-button${filled ? " stamp-button--filled" : ""}`;
  return href ? <a className={className} href={href}>{children}</a> : <button className={className} onClick={onClick} type="button">{children}</button>;
}

function RuleWords({ text }: { text: string }) {
  const words = text.split(/\s+/);
  return <>{words.map((word, index) => <span className="rule-word" key={`${word}-${index}`}>{word}{index < words.length - 1 ? " " : ""}</span>)}</>;
}

function ProjectSheet({ project, number, total, onCaseStudy }: {
  project: Project;
  number: number;
  total: number;
  onCaseStudy: (project: Project, trigger: HTMLButtonElement) => void;
}) {
  const [frame, setFrame] = useState(0);
  const caseButton = useRef<HTMLButtonElement>(null);

  return (
    <section className="sheet project-sheet" id={project.id === content.projects[0]?.id ? "work" : `project-${project.id}`} data-sheet="work" data-label={`Work / ${project.title}`} style={{ backgroundColor: project.color, zIndex: number }} aria-labelledby={`project-title-${project.id}`}>
      <SheetLabel number={number} total={total} title={`Work ${project.id}`} />
      <div className="sheet-inner project-inner">
        <h2 className="display-title project-heading" id={`project-title-${project.id}`}>{project.title}</h2>
        <div className="project-device-wrap">
          <div className="project-device">
            <div className="device-screen" data-frame={frame}>
              <Image
                src={`/shots/screen-${String(frame + 1).padStart(2, "0")}-1200.webp`}
                alt={`${project.title} placeholder screen ${frame + 1}. Replace with a real project screenshot.`}
                fill
                sizes="(max-width: 700px) 84vw, 44vw"
                priority={frame === 0 && project.id === content.projects[0]?.id}
              />
            </div>
          </div>
          <div className="gallery-control">
            <span className="mono">{String(frame + 1).padStart(2, "0")} / 03</span>
            <button type="button" onClick={() => setFrame((value) => (value + 1) % 3)}>View next →</button>
          </div>
        </div>
        <div className="project-copy">
          <div className="project-meta mono"><span>{project.type}</span><span>{project.year}</span></div>
          <p className="project-description">{project.description}</p>
          <ul className="stack-list mono" aria-label="Technology and disciplines">{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
          <div className="project-actions">
            <StampButton href={project.href} filled>Visit project ↗</StampButton>
            <button ref={caseButton} className="stamp-button" type="button" onClick={() => caseButton.current && onCaseStudy(project, caseButton.current)}>Case study ↗</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContributionSheet({ number, total }: { number: number; total: number }) {
  const [data, setData] = useState<ContributionsResponse | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/contributions")
      .then((response) => response.json())
      .then((result: ContributionsResponse) => { if (active) setData(result); })
      .catch(() => { if (active) setData({ configured: false }); });
    return () => { active = false; };
  }, []);

  const days = data?.weeks?.flatMap((week) => week.contributionDays) ?? [];

  return (
    <section className="sheet commits-sheet" id="commits" data-sheet="commits" data-label="A year of code" style={{ zIndex: number }}>
      <SheetLabel number={number} total={total} title="Commits" />
      <div className="sheet-inner commits-inner">
        <p className="eyebrow">A small record of showing up</p>
        <h2 className="display-title commits-title">A year<br />of code.</h2>
        <div className="heatmap-wrap" aria-label="GitHub contributions for the last year">
          {days.length ? <div className="heatmap">{days.map((day) => {
            const level = day.contributionCount === 0 ? 0 : Math.min(4, Math.ceil(day.contributionCount / 3));
            return <span className="heat-cell" data-level={level} key={day.date} title={`${day.date}: ${day.contributionCount} contributions`} />;
          })}</div> : <p className="heatmap-note">{data?.error ?? "Contribution history appears here after GitHub credentials are added."}</p>}
        </div>
        <div className="contribution-stats">
          <div className="contribution-stat"><span className="mono">Busiest day</span><strong>{data?.stats?.busiestDay ?? "—"}</strong></div>
          <div className="contribution-stat"><span className="mono">Longest streak</span><strong>{data?.stats ? `${data.stats.longestStreak} days` : "—"}</strong></div>
          <div className="contribution-stat"><span className="mono">Last 3 months</span><strong>{data?.stats ? `${data.stats.recentShare}%` : "—"}</strong></div>
        </div>
      </div>
    </section>
  );
}

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeSection, setActiveSection] = useState({ id: "cover", label: "Cover" });
  const [copied, setCopied] = useState(false);
  const [lightTheme, setLightTheme] = useState(false);
  const [printing, setPrinting] = useState(true);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const totalSheets = 1 + content.projects.length + 1 + 1 + 1 + content.rules.length + 1;
  let sheetNumber = 1;
  const coverNumber = sheetNumber++;
  const projectNumbers = content.projects.map(() => sheetNumber++);
  const alsoNumber = sheetNumber++;
  const commitsNumber = sheetNumber++;
  const storyNumber = sheetNumber++;
  const approachNumbers = content.rules.map(() => sheetNumber++);
  const contactNumber = sheetNumber;

  useEffect(() => {
    const timer = window.setTimeout(() => setPrinting(false), 850);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    gsap.utils.toArray<HTMLElement>(".project-device").forEach((device) => {
      gsap.to(device, { rotateX: 0, rotateY: 0, y: -18, ease: "none", scrollTrigger: { trigger: device, start: "top bottom", end: "bottom top", scrub: true } });
    });
    gsap.utils.toArray<HTMLElement>(".rule-word").forEach((word) => {
      gsap.fromTo(word, { opacity: 0.35 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: word.closest(".rule-step"), start: "top 78%", end: "center 46%", scrub: true } });
    });
    return () => {
      gsap.ticker.remove(tick);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection({
            id: entry.target.getAttribute("data-sheet") ?? "cover",
            label: entry.target.getAttribute("data-label") ?? "Portfolio",
          });
        }
      });
    }, { rootMargin: "-42% 0px -48% 0px" });
    document.querySelectorAll<HTMLElement>("[data-sheet]").forEach((sheet) => observer.observe(sheet));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const move = (event: globalThis.PointerEvent) => {
      document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => { document.documentElement.dataset.theme = lightTheme ? "light" : "dark"; }, [lightTheme]);

  const dialogOpen = menuOpen || Boolean(selectedProject);
  useEffect(() => {
    if (!dialogOpen) return;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => dialog?.querySelector<HTMLElement>("button, a[href]")?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenuOpen(false); setSelectedProject(null); }
      if (event.key !== "Tab" || !dialog) return;
      const focusable = [...dialog.querySelectorAll<HTMLElement>("button, a[href]")].filter((element) => !element.hasAttribute("disabled"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      (returnFocus.current ?? previousFocus)?.focus();
      returnFocus.current = null;
    };
  }, [dialogOpen]);

  const closeDialog = () => { setMenuOpen(false); setSelectedProject(null); };
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(content.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch { window.location.href = `mailto:${content.email}`; }
  };
  const updatePortraitLight = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--light-x", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    event.currentTarget.style.setProperty("--light-y", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  };

  return (
    <>
      {printing && <div className="intro-wipe" aria-hidden="true">Printing…</div>}
      <div className="cursor-dot" aria-hidden="true" />
      <div className="floating-tools" aria-label="Site controls">
        <button className="tool-button" type="button" aria-label={lightTheme ? "Switch to dark theme" : "Switch to light theme"} aria-pressed={lightTheme} onClick={() => setLightTheme((value) => !value)}>◐</button>
        <button className="tool-button" type="button" aria-label="Open index" aria-expanded={menuOpen} onClick={(event) => { returnFocus.current = event.currentTarget; setMenuOpen(true); }}>{menuOpen ? "×" : "+"}</button>
      </div>
      <div className="section-indicator" aria-live="polite">({String(Math.max(0, navigation.findIndex((item) => item.id === activeSection.id) + 1)).padStart(2, "0")}) {activeSection.label}</div>

      <main>
        <section className="sheet cover-sheet" id="cover" data-sheet="cover" data-label="Cover" style={{ zIndex: coverNumber }}>
          <SheetLabel number={coverNumber} total={totalSheets} title="Cover" />
          <div className="sheet-inner cover-inner">
            <div className="cover-status">
              <p className="status-line mono"><span className="status-dot" /> Now — working on {content.name.currently}</p>
              <div className="contribution-dots" aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <span key={index} />)}</div>
              <p className="eyebrow">Last contribution {content.name.daysSinceContribution} ago</p>
              <p className="cover-tagline">{content.name.tagline}</p>
              <StampButton href="#contact" filled>Say hello ↗</StampButton>
            </div>
            <figure className="portrait-frame">
              <div className="portrait-art" onPointerMove={updatePortraitLight}>
                <Image src="/shots/portrait.webp" alt={content.portraitAlt} fill priority sizes="(max-width: 700px) 36vw, 30vw" className="portrait-image" />
              </div>
              <figcaption className="portrait-caption">Lit from behind</figcaption>
            </figure>
            <div className="cover-name"><span className="cover-first">{content.name.first}</span><h1 className="display-title cover-last">{content.name.last}</h1></div>
          </div>
        </section>

        {content.projects.map((project, index) => <ProjectSheet key={project.id} project={project} number={projectNumbers[index]} total={totalSheets} onCaseStudy={(selected, trigger) => { returnFocus.current = trigger; setSelectedProject(selected); }} />)}

        <section className="sheet also-sheet" id="also-built" data-sheet="work" data-label="Also built" style={{ zIndex: alsoNumber }}>
          <SheetLabel number={alsoNumber} total={totalSheets} title="Also built" />
          <div className="sheet-inner also-inner">
            <h2 className="display-title also-heading">Also built.</h2>
            <div className="also-list">{content.alsoBuilt.map((item, index) => <a className="also-item" href={item.href} key={item.title}><span className="also-thumb" aria-hidden="true">0{index + 1}</span><span><strong>{item.title}</strong><span className="also-description">{item.description}</span></span><span className="mono" aria-hidden="true">↗</span></a>)}</div>
          </div>
        </section>

        <ContributionSheet number={commitsNumber} total={totalSheets} />

        <section className="sheet story-sheet" id="story" data-sheet="story" data-label="My story" style={{ zIndex: storyNumber }}>
          <SheetLabel number={storyNumber} total={totalSheets} title="Story" />
          <div className="sheet-inner story-inner">
            <h2 className="display-title story-title">A little<br />context.</h2>
            <div className="story-copy">{content.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            <div className="story-photos" aria-label="Placeholder photographs"><div className="story-photo" role="img" aria-label="Placeholder photograph one">Replace with<br />a photo</div><div className="story-photo" role="img" aria-label="Placeholder photograph two">Replace with<br />a photo</div></div>
            <div className="time-card" aria-label="Work history">
              <div className="time-card-head mono"><span>In</span><span>Out</span><span>Employer</span><span>Role</span><span>Total duration</span></div>
              {content.jobs.map((job) => <div className="job-row" key={`${job.employer}-${job.start}`}><span>{job.start}</span><span>{job.end}</span><span>{job.employer}</span><span>{job.role}</span><span className="job-total">{job.current && <span className="clock-dot" />}{job.current ? `On the clock · ${job.duration}` : job.duration}</span></div>)}
            </div>
          </div>
        </section>

        {content.rules.map((rule, index) => <section className="sheet approach-sheet" id={index === 0 ? "approach" : `rule-${index + 1}`} data-sheet="approach" data-label="House rules" key={rule.accent} style={{ zIndex: approachNumbers[index] }}>
          <SheetLabel number={approachNumbers[index]} total={totalSheets} title={`Approach ${String(index + 1).padStart(2, "0")} / 04`} />
          <div className="sheet-inner approach-inner">{index === 0 && <p className="eyebrow">House rules, marked up</p>}<div className="rule-step"><span className="rule-index mono">{String(index + 1).padStart(2, "0")} / 04</span><div><h2 className="rule-headline"><RuleWords text={rule.lead} />{" "}<del><RuleWords text={rule.crossed} /></del>{" "}<em><RuleWords text={rule.accent} /></em>{" "}<RuleWords text={rule.tail} /></h2><p className="rule-body">{rule.body}</p><p className="rule-example mono">{rule.example}</p></div></div></div>
        </section>)}

        <section className="sheet contact-sheet" id="contact" data-sheet="contact" data-label="Say hello" style={{ zIndex: contactNumber }}>
          <SheetLabel number={contactNumber} total={totalSheets} title="Contact" />
          <div className="sheet-inner contact-inner">
            <p className="eyebrow">Have a good one in mind?</p><h2 className="display-title contact-heading">Let’s talk.</h2>
            <div className="contact-email"><a href={`mailto:${content.email}`}>{content.email}</a><StampButton onClick={copyEmail}>Copy address ↗</StampButton></div>
            <div className="contact-details"><div><h2>Open to</h2><ul>{content.openTo.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h2>Elsewhere</h2><ul>{content.links.map((link) => <li key={link.label}><a href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a></li>)}</ul></div></div>
            <footer className="contact-footer"><span>{content.name.first} {content.name.last} · {content.name.location}</span><a href="#cover">Back to the cover ↑</a></footer>
          </div>
        </section>
      </main>

      {menuOpen && <div className="overlay-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
        <nav className="overlay-panel overlay-panel--index" role="dialog" aria-modal="true" aria-labelledby="index-title" ref={dialogRef}>
          <button className="overlay-close" type="button" onClick={closeDialog} aria-label="Close index">×</button><p className="eyebrow">Index / Contents</p><h2 className="display-title index-title" id="index-title">Find a page.</h2>
          <div className="index-list">{navigation.map((item, index) => <a className="index-link" href={`#${item.id}`} key={item.id} onClick={closeDialog}><span>0{index + 1}</span>{item.label}</a>)}</div>
        </nav>
      </div>}

      {selectedProject && <div className="overlay-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
        <article className="overlay-panel" role="dialog" aria-modal="true" aria-labelledby="case-title" ref={dialogRef}>
          <button className="overlay-close" type="button" onClick={closeDialog} aria-label="Close case study">×</button><p className="eyebrow">Case study / {selectedProject.type}</p><h2 className="display-title case-title" id="case-title">{selectedProject.title}</h2><p className="case-summary">{selectedProject.summary}</p>
          <div className="case-stats">{selectedProject.stats.map((stat) => <div className="case-stat" key={stat.label}><span className="mono">{stat.label}</span><strong>{stat.value}</strong></div>)}</div>
          <section className="case-section"><h3>Problem</h3><p>{selectedProject.problem}</p></section><section className="case-section"><h3>My part</h3><p>{selectedProject.part}</p></section><section className="case-section"><h3>Outcome</h3><p>{selectedProject.outcome}</p></section>
        </article>
      </div>}
      {copied && <div className="toast" role="status">Address copied</div>}
    </>
  );
}