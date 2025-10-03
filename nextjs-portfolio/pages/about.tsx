import { GetStaticProps } from 'next';
import Layout from '../components/Layout';
import { portfolioService } from '../lib/supabase';
import { PersonalInfo } from '../types/portfolio';

interface AboutProps {
  personalInfo: PersonalInfo | null;
}

export default function About({ personalInfo }: AboutProps) {
  const skills = [
    { name: 'React/Next.js', level: 95 },
    { name: 'Flutter/Dart', level: 90 },
    { name: 'Node.js', level: 85 },
    { name: 'Python', level: 80 },
    { name: 'TypeScript', level: 90 },
    { name: 'PostgreSQL', level: 85 },
  ];

  const experience = [
    {
      title: 'Senior Full Stack Developer',
      company: 'Tech Solutions Inc.',
      period: '2022 - Present',
      description: 'Led development of enterprise applications using React, Node.js, and cloud technologies.'
    },
    {
      title: 'Mobile App Developer',
      company: 'Innovation Labs',
      period: '2020 - 2022',
      description: 'Built cross-platform mobile applications using Flutter and React Native.'
    },
    {
      title: 'Software Engineer',
      company: 'StartupXYZ',
      period: '2018 - 2020',
      description: 'Developed web applications and APIs using modern JavaScript frameworks.'
    }
  ];

  return (
    <Layout title={`About - ${personalInfo?.name || 'Ephraim Umunnakwe'}`}>
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  About Me
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  {personalInfo?.bio || 'Passionate developer with expertise in full-stack development, mobile applications, and modern web technologies.'}
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-blue-400">50+</div>
                    <div className="text-gray-300">Projects</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-green-400">5+</div>
                    <div className="text-gray-300">Years Experience</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-80 h-80 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  {personalInfo?.profile_image_url ? (
                    <img 
                      src={personalInfo.profile_image_url} 
                      alt={personalInfo.name}
                      className="w-72 h-72 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-8xl">👨‍💻</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-16 px-4 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Skills & Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {skills.map((skill) => (
                <div key={skill.name} className="bg-white/5 p-6 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-white font-medium">{skill.name}</span>
                    <span className="text-blue-400">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Experience</h2>
            <div className="space-y-8">
              {experience.map((exp, index) => (
                <div key={index} className="bg-white/5 p-6 rounded-lg border-l-4 border-blue-500">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                      <p className="text-blue-400">{exp.company}</p>
                    </div>
                    <span className="text-gray-400 mt-2 md:mt-0">{exp.period}</span>
                  </div>
                  <p className="text-gray-300">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Let's Work Together</h2>
            <p className="text-gray-300 text-lg mb-8">
              Ready to bring your ideas to life? Let's discuss your next project.
            </p>
            <a
              href="/contact"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold text-lg inline-block"
            >
              Get In Touch
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const personalInfo = await portfolioService.getPersonalInfo();
    return {
      props: { personalInfo },
      revalidate: 3600,
    };
  } catch (error) {
    return {
      props: { personalInfo: null },
    };
  }
};