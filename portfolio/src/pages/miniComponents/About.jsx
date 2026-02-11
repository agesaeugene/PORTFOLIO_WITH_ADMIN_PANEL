import React, { useEffect, useState } from "react";

const About = () => {
  return (
    <div className="w-full flex flex-col overflow-x-hidden">
      <div className="relative">
        <h1
          className="flex gap-4 items-center text-[2rem] sm:text-[2.75rem] 
          md:text-[3rem] lg:text-[3.8rem] leading-[56px] md:leading-[67px] 
          lg:leading-[90px] tracking-[15px] mx-auto w-fit font-extrabold about-h1"
          style={{
            background: "hsl(222.2 84% 4.9%)",
          }}
        >
          ABOUT <span className="text-tubeLight-effect font-extrabold">ME</span>
        </h1>
        <span className="absolute w-full h-1 top-7 sm:top-7 md:top-8 lg:top-11 z-[-1] bg-slate-200"></span>
      </div>
      <div className="text-center">
        <p className="uppercase text-xl text-slate-400">
          Self Introductory.
        </p>
      </div>
      <div>
        <div className="grid md:grid-cols-2 my-8 sm:my-20 gap-14">
          <div className="flex justify-center items-center">
            <img
              src="/me.jpg"
              alt="avatar"
              className="bg-white p-2 sm:p-4 rotate-[25deg] h-[240px] sm:h-[340px] md:h-[350px] lg:h-[450px]"
            />
          </div>
          <div className="flex justify-center flex-col tracking-[1px] text-xl gap-5">
            <p>
              My name is Eugene Agesa,Eugene Agesa, a passionate and disciplined Software Developer 
              and a Bachelor of Science student Software Engineering at 
              Zetech University. I love working as a web developer and freelancer. My hobbies include watching
              movies, series, playing video games, and occasionally cooking. I specialize in building modern, scalable web applications that solve 
              real-world problems and create meaningful user experiences.
            </p>
            <p>
              My core expertise lies in backend and full-stack development, with hands-on experience
               using Python (Flask & Django), Java, JavaScript, Svelte/SvelteKit, and modern database 
               systems such as PostgreSQL and MongoDB. I enjoy designing clean system architectures, 
               implementing secure authentication flows, and building data-driven applications with a 
               strong emphasis on performance, usability, and maintainability. I excel in meeting deadlines for
              my work.

            </p>
          </div>
        </div>
        <p className="tracking-[1px] text-xl">
          I am deeply committed to continuous learning and long-term excellence in software engineering. 
          I follow a disciplined, goal-oriented approach to growth, consistently sharpening my problem-solving skills
           through algorithmic challenges (LeetCode), system design, and hands-on project development. My long-term objective
            is to become a world-class software engineer, capable of designing impactful products, leading technical initiatives
             and delivering high-quality solutions at scale.
          My dedication and perseverance in timely delivery of work are integral
          to me. I maintain the courage to face any challenges for extended
          periods.
        </p>
      </div>
    </div>
  );
};

export default About;
