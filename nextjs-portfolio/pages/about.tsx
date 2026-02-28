import { GetStaticProps } from 'next';
import { Link, User } from 'lucide-react';
import Layout from '../components/Layout';
import { portfolioService } from '../lib/supabase';
import { PersonalInfo } from '../types/portfolio';

interface AboutProps {
  personalInfo: PersonalInfo | null;
}

export default function About({ personalInfo }: AboutProps) {
  const skills = [
    { name: 'Flutter/Dart', level: 90 },
    { name: 'Next.js', level: 80 },
    { name: 'Node.js', level: 85 },
    { name: 'Python', level: 86 },
    { name: 'TypeScript', level: 90 },
    { name: 'PostgreSQL', level: 85 },
  ];

  const experience = [
    {
      title: 'Flutter Developer',
      company: 'Coder\'s Triangle',
      period: 'Apr 2025 – Present',
      description: 'Collaborated with a cross-functional team to maintain and enhance \'Confide\' (Social Media App) and \'CTLearn\' (Ed-Tech Platform). Integrated push and in-app notifications using Firebase Cloud Messaging, improving user engagement by 25%. Implemented secure user authentication and optimized app performance, reducing ANR rates to below 0.5%.'
    },
    {
      title: 'Senior Flutter Developer',
      company: 'Xeno Technologies',
      period: 'Oct 2023 – Jan 2025',
      description: 'Developed and maintained a cross-platform crypto mining application using Flutter, achieving over 150k installations and 17k+ daily active users. Implemented JWT-based authentication, notifications using FCM and OneSignal, and CRUD API operations. Optimized app performance to achieve less than 1% ANR reports and a 4.0 rating on the Play Store.'
    },
    {
      title: 'Flutter Developer',
      company: 'ProjKonnect',
      period: 'Apr 2023 – Nov 2024',
      description: 'Built a scalable Ed-Tech Flutter application with features like notifications, chat, video streaming, media download, and payment integration. Deployed application on Play Store and App Store; currently runs on over 500 devices nationwide. Integrated third-party services such as Paystack for in-app purchases and secured user data using encryption algorithms.'
    }
  ];

  return (
    <Layout title={`About - ${personalInfo?.name || 'Ephraim Umunnakwe'}`}>
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
                  <div className="text-5xl font-black text-accent mb-2">20+</div>
                  <div className="text-neutral-600 dark:text-neutral-400 font-bold uppercase tracking-widest text-sm">Projects</div>
                </div>
                <div className="bg-neutral-100 dark:bg-neutral-800/50 p-8 border-2 border-neutral-900 dark:border-neutral-700">
                  <div className="text-5xl font-black text-neutral-900 dark:text-secondary mb-2">8+</div>
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
      <section className="py-32 px-4 bg-neutral-50 dark:bg-secondary border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-neutral-900 dark:text-secondary mb-20 uppercase">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill) => (
              <div key={skill.name} className="bg-white dark:bg-primary p-8 border-2 border-neutral-900 dark:border-neutral-800">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-xl font-black uppercase tracking-tight text-neutral-900 dark:text-secondary">{skill.name}</span>
                  <span className="text-accent font-black">{skill.level}%</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-4 border-2 border-neutral-900 dark:border-neutral-700">
                  <div
                    className="bg-accent h-full transition-all duration-1000"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-32 px-4 bg-secondary dark:bg-primary">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-neutral-900 dark:text-secondary mb-20 uppercase">Experience</h2>
          <div className="space-y-12">
            {experience.map((exp, index) => (
              <div key={index} className="p-10 border-2 border-neutral-900 dark:border-neutral-800 hover:bg-neutral-900 hover:text-white dark:hover:bg-secondary dark:hover:text-primary transition-all duration-300 group">
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

      {/* CTA Section */}
      <section className="py-40 px-4 bg-accent text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-10 uppercase">Start a Project</h2>
          <p className="text-2xl text-white/80 mb-12 font-medium max-w-2xl mx-auto">
            Bring your vision to life with architectural engineering.
          </p>
          <Link
            href="/contact"
            className="bg-white text-accent px-12 py-5 border-4 border-white font-black text-xl uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-all inline-block"
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
    const personalInfo = await portfolioService.getPersonalInfo();
    return {
      props: { personalInfo },
    };
  } catch (error) {
    return {
      props: { personalInfo: null },
    };
  }
};