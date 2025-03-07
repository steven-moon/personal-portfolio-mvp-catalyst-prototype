export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
}

export interface SkillCategory {
  id?: string;
  title: string;
  skills: string[];
}

export interface AboutMeData {
  intro: {
    headline: string;
    subheadline: string;
  };
  story: string[];
  workExperience: WorkExperience[];
  education: Education[];
  skillCategories: SkillCategory[];
  values: {
    id: string;
    title: string;
    description: string;
  }[];
}

// Example About Me data based on your resume:
export const ABOUT_DATA: AboutMeData = {
  intro: {
    headline: "About Me",
    subheadline:
      "I'm an innovative AI and Blockchain Advisor with extensive experience in software development, AI solutions, and blockchain technologies."
  },
  story: [
    "Throughout my 24+ year career in tech, I have guided companies in successfully integrating AI, blockchain, and other cutting-edge solutions. I’ve founded and led multiple ventures, ranging from AI-centric mobile apps to robust, enterprise-scale platforms.",
    "My passion lies in architecting and implementing AI-driven applications that leverage both local and cloud-based models, balancing performance with scalability. In addition, I have significant experience leading teams, managing projects, and mentoring developers to achieve business goals.",
    "Outside of coding and consulting, I enjoy staying current on new AI frameworks, exploring blockchain innovations, and building solutions that expand what’s possible in technology."
  ],
  workExperience: [
    {
      id: "1",
      title: "AI and Blockchain Advisor",
      company: "Clever Coding (Lehi, Utah)",
      period: "Dec 2024 – Present",
      description:
        "Provide strategic guidance in AI-driven development, leveraging on-device and cloud-based AI models. Advise on LLMs, generative AI, blockchain integrations, and oversee AI research initiatives."
    },
    {
      id: "2",
      title: "Founder & Lead Dev, PocketMind (iOS App)",
      company: "Utah",
      period: "Oct 2024 – Present",
      description:
        "Conceived and launched an AI-powered mobile application offering private on-device AI while supporting cloud-based AI services. Integrated leading open-source AI models and designed seamless local/cloud AI switching."
    },
    {
      id: "3",
      title: "VP of Engineering",
      company: "Nerd United (Lehi, Utah)",
      period: "June 2023 – Nov 2024",
      description:
        "Led the architecture and development of blockchain governance solutions, including on-chain voting systems, token bridges, and Node Ownership Oracles, primarily using React, Solidity, Python, and Go."
    },
    {
      id: "4",
      title: "Founder & CEO",
      company: "Clever Coding (Lehi, Utah)",
      period: "July 2008 – June 2023",
      description:
        "Managed a team of 10–15 employees, led sales, architected and built 100+ mobile and web apps, integrated complex APIs, oversaw AWS configurations, and developed large-scale Unity3D games."
    },
    {
      id: "5",
      title: "Software Consultant",
      company: "Gideon Taylor (American Fork, Utah)",
      period: "Jan 2007 – June 2008",
      description:
        "Implemented custom HR systems for universities, collaborating closely with stakeholders to integrate PeopleSoft solutions and streamline processes."
    },
    {
      id: "6",
      title: "Senior Developer / Team Lead",
      company: "BYU (Provo, Utah)",
      period: "July 2000 – Jan 2007",
      description:
        "Led development projects on the PeopleSoft platform, including a large-scale class registration system for a 100,000+ student body."
    }
  ],
  education: [
    {
      id: "1",
      degree: "Bachelor of Science in Computer Science",
      institution: "Brigham Young University, Provo, Utah",
      period: "Graduated in 2000",
      description: "Focused on software engineering, algorithms, and systems design."
    }
  ],
  skillCategories: [
    {
      id: "1",
      title: "Technical & Development",
      skills: [
        "iOS (Swift/Objective-C)",
        "Android (Kotlin/Java)",
        "Vue/Nuxt",
        "Node/Express",
        "React/Next.js",
        "JavaScript",
        "Python",
        "PHP",
        "Ruby on Rails",
        "Unity3D"
      ]
    },
    {
      id: "2",
      title: "AI & Blockchain",
      skills: [
        "Generative AI (LLMs, MLX, Llama.cpp)",
        "Local AI on iOS & Servers",
        "OpenAI/Anthropic Integrations",
        "Solidity/Remix",
        "Web3 Frontend",
        "Blockchain Governance",
        "Token Bridges"
      ]
    },
    {
      id: "3",
      title: "Leadership & Cloud",
      skills: [
        "Leadership & Management",
        "Project Management",
        "AWS",
        "Microsoft Azure",
        "Mentoring Teams",
        "System Architecture"
      ]
    }
  ],
  values: [
    {
      id: "1",
      title: "Innovation",
      description:
        "I strive to push boundaries by exploring new AI and blockchain technologies to deliver cutting-edge solutions."
    },
    {
      id: "2",
      title: "Collaboration",
      description:
        "I believe breakthrough ideas emerge from strong teams, open communication, and clear shared goals."
    },
    {
      id: "3",
      title: "Continuous Learning",
      description:
        "Technology never stands still, and I stay sharp by constantly exploring new frameworks, platforms, and concepts."
    },
    {
      id: "4",
      title: "Integrity & Responsibility",
      description:
        "Building secure, ethical, and reliable systems is paramount, and I take data privacy and compliance seriously."
    }
  ]
};