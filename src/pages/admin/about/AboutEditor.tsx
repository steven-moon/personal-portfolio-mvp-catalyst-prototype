import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import { Save, Plus, Trash, Briefcase, GraduationCap, Award, Heart } from 'lucide-react';

interface WorkExperience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
}

interface AboutMeData {
  intro: {
    headline: string;
    subheadline: string;
  };
  story: string[];
  workExperience: WorkExperience[];
  education: Education[];
  skills: {
    technical: string[];
    design: string[];
  };
  values: {
    id: string;
    title: string;
    description: string;
  }[];
}

const AboutEditor = () => {
  const [aboutData, setAboutData] = useState<AboutMeData>({
    intro: {
      headline: "About Me",
      subheadline: "I'm a passionate developer with a keen eye for design and a love for creating intuitive, beautiful digital experiences."
    },
    story: [
      "With over 5 years of experience in web development, I've had the opportunity to work on a diverse range of projects, from small business websites to complex web applications for enterprise clients.",
      "My approach to development is centered around the user experience. I believe that great software should not only function flawlessly but also provide an intuitive and enjoyable experience for the end user.",
      "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or enjoying outdoor activities to recharge my creative energy."
    ],
    workExperience: [
      {
        id: "1",
        title: "Senior Frontend Developer",
        company: "Tech Solutions Inc.",
        period: "2020 - Present",
        description: "Leading frontend development for enterprise clients, focusing on React applications with TypeScript."
      },
      {
        id: "2",
        title: "UI/UX Developer",
        company: "Creative Agency",
        period: "2017 - 2020",
        description: "Designed and developed responsive websites and interactive prototypes."
      }
    ],
    education: [
      {
        id: "1",
        degree: "Master of Computer Science",
        institution: "University of Technology",
        period: "2015 - 2017",
        description: "Specialized in Human-Computer Interaction and User Interface Design."
      },
      {
        id: "2",
        degree: "Bachelor of Software Engineering",
        institution: "State University",
        period: "2011 - 2015",
        description: "Foundation in programming, software design, and development methodologies."
      }
    ],
    skills: {
      technical: ["React", "TypeScript", "Next.js", "HTML/CSS", "JavaScript", "Node.js", "Git", "TailwindCSS"],
      design: ["UI/UX Design", "Figma", "Responsive Design", "Design Systems", "Wireframing"]
    },
    values: [
      {
        id: "1",
        title: "User-Centered Design",
        description: "I believe in putting the user first in all design and development decisions."
      },
      {
        id: "2",
        title: "Continuous Learning",
        description: "Technology evolves rapidly, and I'm committed to always learning and improving."
      },
      {
        id: "3",
        title: "Attention to Detail",
        description: "The small details often make the biggest difference in user experience."
      },
      {
        id: "4",
        title: "Collaboration",
        description: "Great products are built by great teams working together."
      }
    ]
  });

  // This effect would typically fetch the current about page content from an API
  useEffect(() => {
    // In a real implementation, we would fetch the content from an API
    // For now, we're using the initial state defined above
  }, []);

  const handleSave = () => {
    // In a real implementation, we would save the content to an API
    console.log("Saving About Me content:", aboutData);
    toast.success("About page content saved successfully");
  };

  // Introduction section handlers
  const handleIntroChange = (field: keyof typeof aboutData.intro, value: string) => {
    setAboutData(prev => ({
      ...prev,
      intro: {
        ...prev.intro,
        [field]: value
      }
    }));
  };

  // Story section handlers
  const handleStoryChange = (index: number, value: string) => {
    setAboutData(prev => {
      const updatedStory = [...prev.story];
      updatedStory[index] = value;
      return { ...prev, story: updatedStory };
    });
  };

  const handleAddStoryParagraph = () => {
    setAboutData(prev => ({
      ...prev,
      story: [...prev.story, "New paragraph content"]
    }));
  };

  const handleRemoveStoryParagraph = (index: number) => {
    if (aboutData.story.length <= 1) {
      toast.warning("You need at least one paragraph in your story");
      return;
    }
    
    setAboutData(prev => {
      const updatedStory = [...prev.story];
      updatedStory.splice(index, 1);
      return { ...prev, story: updatedStory };
    });
  };

  // Work Experience handlers
  const handleWorkExperienceChange = (index: number, field: keyof WorkExperience, value: string) => {
    setAboutData(prev => {
      const updatedWorkExperience = [...prev.workExperience];
      updatedWorkExperience[index] = { 
        ...updatedWorkExperience[index], 
        [field]: value 
      };
      return { ...prev, workExperience: updatedWorkExperience };
    });
  };

  const handleAddWorkExperience = () => {
    setAboutData(prev => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        {
          id: Date.now().toString(),
          title: "New Position",
          company: "Company Name",
          period: "Start - End",
          description: "Description of your role and responsibilities"
        }
      ]
    }));
  };

  const handleRemoveWorkExperience = (index: number) => {
    if (aboutData.workExperience.length <= 1) {
      toast.warning("You need at least one work experience entry");
      return;
    }
    
    setAboutData(prev => {
      const updatedWorkExperience = [...prev.workExperience];
      updatedWorkExperience.splice(index, 1);
      return { ...prev, workExperience: updatedWorkExperience };
    });
  };

  // Education handlers
  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    setAboutData(prev => {
      const updatedEducation = [...prev.education];
      updatedEducation[index] = { 
        ...updatedEducation[index], 
        [field]: value 
      };
      return { ...prev, education: updatedEducation };
    });
  };

  const handleAddEducation = () => {
    setAboutData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now().toString(),
          degree: "New Degree",
          institution: "Institution Name",
          period: "Start - End",
          description: "Description of your studies and achievements"
        }
      ]
    }));
  };

  const handleRemoveEducation = (index: number) => {
    if (aboutData.education.length <= 1) {
      toast.warning("You need at least one education entry");
      return;
    }
    
    setAboutData(prev => {
      const updatedEducation = [...prev.education];
      updatedEducation.splice(index, 1);
      return { ...prev, education: updatedEducation };
    });
  };

  // Skills handlers
  const handleSkillsChange = (type: 'technical' | 'design', skillsList: string) => {
    const skills = skillsList.split(',').map(skill => skill.trim());
    setAboutData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: skills
      }
    }));
  };

  // Values handlers
  const handleValueChange = (index: number, field: 'title' | 'description', value: string) => {
    setAboutData(prev => {
      const updatedValues = [...prev.values];
      updatedValues[index] = { 
        ...updatedValues[index], 
        [field]: value 
      };
      return { ...prev, values: updatedValues };
    });
  };

  const handleAddValue = () => {
    if (aboutData.values.length >= 6) {
      toast.warning("You can have a maximum of 6 personal values");
      return;
    }
    
    setAboutData(prev => ({
      ...prev,
      values: [
        ...prev.values,
        {
          id: Date.now().toString(),
          title: "New Value",
          description: "Description of this personal value"
        }
      ]
    }));
  };

  const handleRemoveValue = (index: number) => {
    if (aboutData.values.length <= 1) {
      toast.warning("You need at least one personal value");
      return;
    }
    
    setAboutData(prev => {
      const updatedValues = [...prev.values];
      updatedValues.splice(index, 1);
      return { ...prev, values: updatedValues };
    });
  };

  return (
    <div className="container py-12 mx-auto page-transition bg-background">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">About Page Editor</h1>
        <NeumorphicButton 
          onClick={handleSave}
          className="flex items-center gap-2"
        >
          <Save size={18} />
          Save Changes
        </NeumorphicButton>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        {/* Introduction Section */}
        <NeumorphicCard>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Introduction</h2>
          
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div>
              <label className="block text-muted-foreground mb-2">Headline</label>
              <input 
                type="text" 
                value={aboutData.intro.headline}
                onChange={(e) => handleIntroChange('headline', e.target.value)}
                className="w-full px-4 py-2 rounded-lg neu-pressed dark:shadow-dark-neu-pressed text-foreground bg-transparent"
              />
            </div>
            
            <div>
              <label className="block text-muted-foreground mb-2">Subheadline</label>
              <input 
                type="text" 
                value={aboutData.intro.subheadline}
                onChange={(e) => handleIntroChange('subheadline', e.target.value)}
                className="w-full px-4 py-2 rounded-lg neu-pressed dark:shadow-dark-neu-pressed text-foreground bg-transparent"
              />
            </div>
          </div>
        </NeumorphicCard>
        
        {/* My Story Section */}
        <NeumorphicCard>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-foreground">My Story</h2>
            <NeumorphicButton 
              variant="secondary" 
              onClick={handleAddStoryParagraph}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Add Paragraph
            </NeumorphicButton>
          </div>
          
          <div className="space-y-6">
            {aboutData.story.map((paragraph, index) => (
              <div key={index} className="neu-flat dark:shadow-dark-neu-flat p-4 relative">
                <button 
                  onClick={() => handleRemoveStoryParagraph(index)}
                  className="absolute top-2 right-2 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500"
                  disabled={aboutData.story.length <= 1}
                >
                  <Trash size={16} />
                </button>
                
                <div>
                  <label className="block text-muted-foreground mb-2">Paragraph {index + 1}</label>
                  <textarea 
                    value={paragraph}
                    onChange={(e) => handleStoryChange(index, e.target.value)}
                    className="w-full px-4 py-2 rounded-lg neu-pressed dark:shadow-dark-neu-pressed text-foreground bg-transparent min-h-[100px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </NeumorphicCard>
        
        {/* Work Experience Section */}
        <NeumorphicCard>
          <div className="flex items-start mb-4">
            <div className="p-3 neu-pressed dark:shadow-dark-neu-pressed rounded-lg mr-4">
              <Briefcase className="text-primary" size={24} />
            </div>
            <div className="flex-grow flex justify-between items-center">
              <h2 className="text-xl font-semibold text-foreground">Work Experience</h2>
              <NeumorphicButton 
                variant="secondary" 
                onClick={handleAddWorkExperience}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Experience
              </NeumorphicButton>
            </div>
          </div>
          
          <div className="space-y-6">
            {aboutData.workExperience.map((experience, index) => (
              <div key={experience.id} className="neu-flat dark:shadow-dark-neu-flat p-4 relative">
                <button 
                  onClick={() => handleRemoveWorkExperience(index)}
                  className="absolute top-2 right-2 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500"
                  disabled={aboutData.workExperience.length <= 1}
                >
                  <Trash size={16} />
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-muted-foreground mb-2">Job Title</label>
                    <input 
                      type="text" 
                      value={experience.title}
                      onChange={(e) => handleWorkExperienceChange(index, 'title', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg neu-pressed dark:shadow-dark-neu-pressed text-foreground bg-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-muted-foreground mb-2">Company</label>
                    <input 
                      type="text" 
                      value={experience.company}
                      onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg neu-pressed dark:shadow-dark-neu-pressed text-foreground bg-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-muted-foreground mb-2">Time Period</label>
                    <input 
                      type="text" 
                      value={experience.period}
                      onChange={(e) => handleWorkExperienceChange(index, 'period', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg neu-pressed dark:shadow-dark-neu-pressed text-foreground bg-transparent"
                      placeholder="e.g., 2020 - Present"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-muted-foreground mb-2">Description</label>
                    <textarea 
                      value={experience.description}
                      onChange={(e) => handleWorkExperienceChange(index, 'description', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg neu-pressed dark:shadow-dark-neu-pressed text-foreground bg-transparent min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </NeumorphicCard>
        
        {/* Education Section */}
        <NeumorphicCard>
          <div className="flex items-start mb-4">
            <div className="p-3 neu-pressed dark:shadow-dark-neu-pressed rounded-lg mr-4">
              <GraduationCap className="text-primary" size={24} />
            </div>
            <div className="flex-grow flex justify-between items-center">
              <h2 className="text-xl font-semibold text-foreground">Education</h2>
              <NeumorphicButton 
                variant="secondary" 
                onClick={handleAddEducation}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Education
              </NeumorphicButton>
            </div>
          </div>
          
          <div className="space-y-6">
            {aboutData.education.map((education, index) => (
              <div key={education.id} className="neu-flat dark:shadow-dark-neu-flat p-4 relative">
                <button 
                  onClick={() => handleRemoveEducation(index)}
                  className="absolute top-2 right-2 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500"
                  disabled={aboutData.education.length <= 1}
                >
                  <Trash size={16} />
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-muted-foreground mb-2">Degree</label>
                    <input 
                      type="text" 
                      value={education.degree}
                      onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg neu-pressed dark:shadow-dark-neu-pressed text-foreground bg-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-muted-foreground mb-2">Institution</label>
                    <input 
                      type="text" 
                      value={education.institution}
                      onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg neu-pressed dark:shadow-dark-neu-pressed text-foreground bg-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-muted-foreground mb-2">Time Period</label>
                    <input 
                      type="text" 
                      value={education.period}
                      onChange={(e) => handleEducationChange(index, 'period', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg neu-pressed dark:shadow-dark-neu-pressed text-foreground bg-transparent"
                      placeholder="e.g., 2015 - 2017"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-muted-foreground mb-2">Description</label>
                    <textarea 
                      value={education.description}
                      onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg neu-pressed dark:shadow-dark-neu-pressed text-foreground bg-transparent min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </NeumorphicCard>
        
        {/* Skills Section */}
        <NeumorphicCard>
          <div className="flex items-start mb-4">
            <div className="p-3 neu-pressed dark:shadow-dark-neu-pressed rounded-lg mr-4">
              <Award className="text-primary" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Skills</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-muted-foreground mb-2">Technical Skills</label>
              <p className="text-xs text-muted-foreground mb-2">Enter skills separated by commas</p>
              <textarea 
                value={aboutData.skills.technical.join(", ")}
                onChange={(e) => handleSkillsChange('technical', e.target.value)}
                className="w-full px-4 py-2 rounded-lg neu-pressed dark:shadow-dark-neu-pressed text-foreground bg-transparent min-h-[100px]"
                placeholder="React, JavaScript, TypeScript, etc."
              />
            </div>
            
            <div>
              <label className="block text-muted-foreground mb-2">Design Skills</label>
              <p className="text-xs text-muted-foreground mb-2">Enter skills separated by commas</p>
              <textarea 
                value={aboutData.skills.design.join(", ")}
                onChange={(e) => handleSkillsChange('design', e.target.value)}
                className="w-full px-4 py-2 rounded-lg neu-pressed dark:shadow-dark-neu-pressed text-foreground bg-transparent min-h-[100px]"
                placeholder="UI/UX, Figma, Wireframing, etc."
              />
            </div>
          </div>
        </NeumorphicCard>
        
        {/* Personal Values Section */}
        <NeumorphicCard>
          <div className="flex items-start mb-4">
            <div className="p-3 neu-pressed dark:shadow-dark-neu-pressed rounded-lg mr-4">
              <Heart className="text-primary" size={24} />
            </div>
            <div className="flex-grow flex justify-between items-center">
              <h2 className="text-xl font-semibold text-foreground">Personal Values</h2>
              <NeumorphicButton 
                variant="secondary" 
                onClick={handleAddValue}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Value
              </NeumorphicButton>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aboutData.values.map((value, index) => (
              <div key={value.id} className="neu-flat dark:shadow-dark-neu-flat p-4 relative">
                <button 
                  onClick={() => handleRemoveValue(index)}
                  className="absolute top-2 right-2 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500"
                  disabled={aboutData.values.length <= 1}
                >
                  <Trash size={16} />
                </button>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-muted-foreground mb-2">Value Title</label>
                    <input 
                      type="text" 
                      value={value.title}
                      onChange={(e) => handleValueChange(index, 'title', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg neu-pressed dark:shadow-dark-neu-pressed text-foreground bg-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-muted-foreground mb-2">Description</label>
                    <textarea 
                      value={value.description}
                      onChange={(e) => handleValueChange(index, 'description', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg neu-pressed dark:shadow-dark-neu-pressed text-foreground bg-transparent min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </NeumorphicCard>
        
        {/* Preview Button */}
        <div className="flex justify-end mt-4">
          <NeumorphicButton 
            onClick={() => window.open('/about', '_blank')}
            variant="secondary"
          >
            Preview About Page
          </NeumorphicButton>
        </div>
      </div>
    </div>
  );
};

export default AboutEditor;
