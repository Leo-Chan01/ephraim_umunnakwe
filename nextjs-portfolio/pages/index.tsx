import { GetStaticProps } from 'next';
import { portfolioService } from '../lib/supabase';
import { Project, Testimonial, PersonalInfo } from '../types/portfolio';

interface HomeProps {
  projects: Project[];
  testimonials: Testimonial[];
  personalInfo: PersonalInfo | null;
}

export default function Home({ projects, testimonials, personalInfo }: HomeProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">{personalInfo?.name || 'Ephraim Umunnakwe'}</h1>
        <p className="text-xl text-gray-300">{personalInfo?.title || 'Software Developer'}</p>
      </header>

      <section className="py-16 px-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects.map((project) => (
            <div key={project.id} className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
              <p className="text-gray-300 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="bg-blue-600 px-2 py-1 rounded text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-8 bg-gray-800">
        <h2 className="text-3xl font-bold mb-8 text-center">Testimonials</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-700 p-6 rounded-lg">
              <p className="mb-4">"{testimonial.message}"</p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-gray-300 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [projects, testimonials, personalInfo] = await Promise.all([
      portfolioService.getProjects(),
      portfolioService.getTestimonials(),
      portfolioService.getPersonalInfo(),
    ]);

    return {
      props: {
        projects,
        testimonials,
        personalInfo,
      },
      revalidate: 60,
    };
  } catch (error) {
    return {
      props: {
        projects: [],
        testimonials: [],
        personalInfo: null,
      },
    };
  }
};