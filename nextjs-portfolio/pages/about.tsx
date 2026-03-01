import { GetStaticProps } from 'next';
import Link from 'next/link';
import { User, Award, Trophy, Target, Cpu, Cloud, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { portfolioService } from '../lib/supabase';
import { PersonalInfo, Experience, Skill, Achievement } from '../types/portfolio';

interface AboutProps {
  personalInfo: PersonalInfo | null;
  initialExperiences: Experience[];
  initialSkills: Skill[];
  initialAchievements: Achievement[];
  totalProjects: number;
}

export default function About({ personalInfo, initialExperiences, initialSkills, initialAchievements, totalProjects }: AboutProps) {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [projectCount, setProjectCount] = useState<number>(totalProjects);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expData, skillData, achievementData, stats] = await Promise.all([
          portfolioService.getExperiences(),
          portfolioService.getSkills(),
          portfolioService.getAchievements(),
          portfolioService.getDashboardStats()
        ]);

        if (expData && expData.length > 0) setExperiences(expData);
        if (skillData && skillData.length > 0) setSkills(skillData);
        if (achievementData && achievementData.length > 0) setAchievements(achievementData);
        if (stats && stats.projects > 0) setProjectCount(stats.projects);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (!initialExperiences?.length || !initialSkills?.length || !initialAchievements?.length || totalProjects === 0) {
      fetchData();
    }
  }, [initialExperiences, initialSkills, initialAchievements, totalProjects]);

  const getAchievementIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Award': return <Award size={24} />;
      case 'Trophy': return <Trophy size={24} />;
      case 'Target': return <Target size={24} />;
      case 'Cpu': return <Cpu size={24} />;
      case 'Cloud': return <Cloud size={24} />;
      case 'Zap': return <Zap size={24} />;
      default: return <Award size={24} />;
    }
  };

  return (
    <Layout title={`About - ${personalInfo?.name || 'Ephraim Umunnakwe'} `}>
      {/* Hero Section */}
      <section className="mt-16 py-32 px-4 bg-secondary dark:bg-primary border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tightest text-neutral-900 dark:text-secondary mb-8 uppercase leading-tight">
                About<br />Me
              </h1>
              <p className="text-2xl text-neutral-600 dark:text-neutral-400 mb-12 font-medium">
                {personalInfo?.bio || 'Passionate developer with expertise in full-stack development, mobile applications, and modern web technologies.'}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-neutral-100 dark:bg-neutral-800/50 p-8 border-2 border-neutral-900 dark:border-neutral-700">
                  <div className="text-5xl font-black text-accent mb-2">{projectCount}+</div>
                  <div className="text-neutral-600 dark:text-neutral-400 font-bold uppercase tracking-widest text-sm">Projects</div>
                </div>
                <div className="bg-neutral-100 dark:bg-neutral-800/50 p-8 border-2 border-neutral-900 dark:border-neutral-700">
                  <div className="text-5xl font-black text-neutral-900 dark:text-secondary mb-2">{personalInfo?.years_of_experience || 8}+</div>
                  <div className="text-neutral-600 dark:text-neutral-400 font-bold uppercase tracking-widest text-sm">Years</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-80 h-80 md:w-[500px] md:h-[500px] bg-neutral-900 dark:bg-secondary border-4 border-neutral-900 dark:border-accent flex items-center justify-center p-4">
                {personalInfo?.profile_image_url ? (
                  <img
                    src={personalInfo.profile_image_url}
                    alt={personalInfo.name}
                    className="w-full h-full object-cover grayscale active:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <User size={128} className="text-white dark:text-primary" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-32 px-4 bg-neutral-50 dark:bg-primary border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-neutral-900 dark:text-secondary mb-20 uppercase">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill) => (
              <div key={skill.id || skill.name} className="bg-white dark:bg-primary p-8 border-2 border-neutral-900 dark:border-neutral-800">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-xl font-black uppercase tracking-tight text-neutral-900 dark:text-secondary">{skill.name}</span>
                  <span className="text-accent font-black">{skill.level}%</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-4 border-2 border-neutral-900 dark:border-neutral-700">
                  <div
                    className="bg-accent h-full transition-all duration-1000"
                    style={{ width: `${skill.level}% ` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-32 px-4 bg-secondary dark:bg-primary border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-neutral-900 dark:text-secondary mb-20 uppercase">Experience</h2>
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={exp.id || index} className="p-10 border-2 border-neutral-900 dark:border-neutral-800 hover:bg-neutral-900 hover:text-white dark:hover:bg-secondary dark:hover:text-primary transition-all duration-300 group">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-tight mb-2">{exp.title}</h3>
                    <p className="text-accent font-bold uppercase tracking-widest">{exp.company}</p>
                  </div>
                  <span className="text-neutral-500 font-bold uppercase tracking-widest mt-4 md:mt-2">{exp.period}</span>
                </div>
                <p className="text-xl text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-300 dark:group-hover:text-neutral-600 leading-relaxed max-w-4xl font-medium">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <section className="py-32 px-4 bg-neutral-50 dark:bg-primary">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-neutral-900 dark:text-secondary mb-20 uppercase">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="bg-white dark:bg-primary p-10 border-4 border-neutral-900 dark:border-neutral-800 flex items-start gap-8 group hover:translate-x-2 transition-transform">
                  <div className="w-16 h-16 bg-neutral-900 dark:bg-accent flex items-center justify-center text-white shrink-0">
                    {getAchievementIcon(achievement.icon)}
                  </div>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter">{achievement.title}</h3>
                      <span className="text-accent font-black">{achievement.year}</span>
                    </div>
                    <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs mb-4">{achievement.organization}</p>
                    <p className="text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-40 px-4 bg-accent text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-10 uppercase">Start a Project</h2>
          <p className="text-2xl text-white/80 mb-12 font-medium max-w-2xl mx-auto">
            Bring your vision to life with architectural engineering.
          </p>
          <Link
            href="/contact"
            className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-12 py-5 border-4 border-neutral-900 dark:border-white font-black text-xl uppercase tracking-widest hover:bg-white hover:text-accent dark:hover:bg-neutral-900 dark:hover:text-white transition-all inline-block"
          >
            Get In Touch
          </Link>
        </div>
      </section>

    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [personalInfo, experiences, skills, achievements, stats] = await Promise.all([
      portfolioService.getPersonalInfo(),
      portfolioService.getExperiences(),
      portfolioService.getSkills(),
      portfolioService.getAchievements(),
      portfolioService.getDashboardStats()
    ]);

    return {
      props: {
        personalInfo,
        initialExperiences: experiences,
        initialSkills: skills,
        initialAchievements: achievements,
        totalProjects: stats.projects || 0
      },
    };
  } catch (error) {
    return {
      props: {
        personalInfo: null,
        initialExperiences: [],
        initialSkills: [],
        initialAchievements: [],
        totalProjects: 0
      },
    };
  }
};