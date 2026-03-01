import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import Layout from '../components/Layout';
import RefreshButton from '../components/RefreshButton';
import { portfolioService } from '../lib/supabase';
import { ServiceItem } from '../types/portfolio';
import { Smartphone as Mobile, Globe, Zap, ShoppingCart, Lightbulb, Wrench } from 'lucide-react';

interface ServicesProps {
  initialServices: ServiceItem[];
}

export default function Services({ initialServices }: ServicesProps) {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const data = await portfolioService.getServices();
      setServices(data);
    } catch (error) {
      console.error('Error refreshing services:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (initialServices.length === 0) {
      refreshData();
    }
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe size={32} />;
      case 'Mobile': return <Mobile size={32} />;
      case 'Zap': return <Zap size={32} />;
      case 'ShoppingCart': return <ShoppingCart size={32} />;
      case 'Lightbulb': return <Lightbulb size={32} />;
      case 'Wrench': return <Wrench size={32} />;
      default: return <Globe size={32} />;
    }
  };

  const processSteps = [
    {
      step: '01',
      title: 'Discovery',
      description: 'We discuss your project requirements, feasibility, goals, and timeline.'
    },
    {
      step: '02',
      title: 'Planning',
      description: 'I create a detailed project plan with milestones and deliverables.'
    },
    {
      step: '03',
      title: 'Development',
      description: 'Building your solution with regular updates and feedback sessions.'
    },
    {
      step: '04',
      title: 'Testing',
      description: 'Thorough testing to ensure quality and performance standards.'
    },
    {
      step: '05',
      title: 'Deployment',
      description: 'Launch your project and provide training and documentation.'
    },
    {
      step: '06',
      title: 'Support',
      description: 'Ongoing maintenance and support to keep everything running smoothly.'
    }
  ];

  return (
    <Layout title="Services - Ephraim Umunnakwe">
      <RefreshButton onRefresh={refreshData} isRefreshing={isRefreshing} />

      {/* Hero Section */}
      <section className="mt-16 py-32 px-4 bg-secondary dark:bg-primary border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black tracking-tightest text-neutral-900 dark:text-secondary mb-8 uppercase leading-tight">
            Design<br />Systems
          </h1>
          <p className="text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl font-medium leading-relaxed">
            Scalable digital architectures tailored for high-performance products.
            From concept to deployment, engineered with precision.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32 px-4 bg-neutral-50 dark:bg-primary border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {services.map((service) => (
              <div key={service.id || service.title} className="bg-white dark:bg-primary border-4 border-neutral-900 dark:border-neutral-800 p-10 flex flex-col h-full hover:bg-neutral-900 hover:text-white dark:hover:bg-secondary dark:hover:text-primary transition-all duration-300 group">
                <div className="w-16 h-16 bg-neutral-900 dark:bg-accent flex items-center justify-center text-white mb-8 group-hover:bg-white group-hover:text-neutral-900 transition-colors">
                  {getIcon(service.icon)}
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tight mb-6">{service.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-300 font-medium text-lg mb-8 leading-relaxed">{service.description}</p>

                <ul className="space-y-4 mb-10 mt-auto">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-xs font-black uppercase tracking-widest">
                      <span className="w-6 h-[2px] bg-accent mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="pt-8 border-t-2 border-neutral-100 dark:border-neutral-800 group-hover:border-white/20">
                  <p className="text-accent font-black uppercase tracking-widest">{service.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 px-4 bg-secondary dark:bg-primary border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-neutral-900 dark:text-secondary uppercase">
              The Method
            </h2>
            <p className="text-neutral-400 text-xl font-medium max-w-md">
              A systematic approach to engineering excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {processSteps.map((item, index) => (
              <div key={index} className="relative pt-12 border-t-2 border-neutral-900 dark:border-neutral-800">
                <span className="absolute top-0 left-0 -translate-y-1/2 bg-accent text-white px-4 py-1 font-black text-sm uppercase tracking-widest">
                  Step {item.step}
                </span>
                <h3 className="text-2xl font-black uppercase tracking-tight text-neutral-900 dark:text-secondary mb-4">{item.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 font-medium text-lg leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-4 bg-accent text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-10 uppercase">Start Your Architecture</h2>
          <p className="text-2xl text-white/80 mb-12 font-medium max-w-2xl mx-auto">
            Bring precision and performance to your next digital product.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="/contact"
              className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-12 py-5 border-4 border-neutral-900 dark:border-white font-black text-xl uppercase tracking-widest hover:bg-white hover:text-accent dark:hover:bg-neutral-900 dark:hover:text-white transition-all"
            >
              Get Free Quote
            </a>
            <a
              href="/projects"
              className="bg-transparent text-white px-12 py-5 border-4 border-white font-black text-xl uppercase tracking-widest hover:bg-white hover:text-accent transition-all"
            >
              View Work
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const services = await portfolioService.getServices();
    return {
      props: {
        initialServices: services,
      },
    };
  } catch (error) {
    return {
      props: {
        initialServices: [],
      },
    };
  }
};