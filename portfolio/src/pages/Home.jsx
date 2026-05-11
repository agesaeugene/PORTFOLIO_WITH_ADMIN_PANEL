import React from "react";
import Hero from "./miniComponents/Hero";
import Timeline from "./miniComponents/Timeline";
import Skills from "./miniComponents/Skills";
import MyApps from "./miniComponents/MyApps";
import About from "./miniComponents/About";
import Portfolio from "./miniComponents/Portfolio";
import Contact from "./miniComponents/Contact";

const Section = ({ id, children }) => (
  <section id={id} className="scroll-mt-24">
    {children}
  </section>
);

const Home = () => {
  return (
    <article className="px-5 sm:mx-auto w-full max-w-[1050px] flex flex-col gap-14 pb-10">
      <Section id="home">
        <Hero />
      </Section>
      <Section id="timeline">
        <Timeline />
      </Section>
      <Section id="about">
        <About />
      </Section>
      <Section id="skills">
        <Skills />
      </Section>
      <Section id="portfolio">
        <Portfolio />
      </Section>
      <Section id="apps">
        <MyApps />
      </Section>
      <Section id="contact">
        <Contact />
      </Section>
    </article>
  );
};

export default Home;