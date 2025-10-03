import Layout from '../components/Layout';

export default function Services() {
  const services = [
    {
      title: 'Web Development',
      description: 'Modern, responsive websites built with React, Next.js, and cutting-edge technologies.',
      features: ['Responsive Design', 'SEO Optimization', 'Performance Focused', 'Modern UI/UX'],
      icon: '🌐',
      price: 'Starting at $2,500'
    },
    {
      title: 'Mobile App Development',
      description: 'Cross-platform mobile applications using Flutter and React Native.',
      features: ['iOS & Android', 'Native Performance', 'Custom UI Design', 'App Store Deployment'],
      icon: '📱',
      price: 'Starting at $5,000'
    },
    {
      title: 'API Development',
      description: 'Robust backend APIs and microservices for your applications.',
      features: ['RESTful APIs', 'Database Design', 'Authentication', 'Documentation'],
      icon: '⚡',
      price: 'Starting at $1,500'
    },
    {
      title: 'E-commerce Solutions',
      description: 'Complete online stores with payment integration and inventory management.',
      features: ['Payment Gateway', 'Inventory System', 'Admin Dashboard', 'Mobile Responsive'],
      icon: '🛒',
      price: 'Starting at $4,000'
    },
    {
      title: 'Technical Consulting',
      description: 'Expert advice on technology stack, architecture, and development strategy.',
      features: ['Technology Assessment', 'Architecture Planning', 'Code Review', 'Team Training'],
      icon: '💡',
      price: '$150/hour'
    },
    {
      title: 'Maintenance & Support',
      description: 'Ongoing support, updates, and maintenance for your applications.',
      features: ['Bug Fixes', 'Security Updates', 'Performance Optimization', '24/7 Support'],
      icon: '🔧',
      price: 'Custom Packages'
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Discovery',
      description: 'We discuss your project requirements, goals, and timeline.'
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
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              My Services
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              I offer comprehensive development services to help bring your digital ideas to life. 
              From concept to deployment, I've got you covered.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-white/5 p-8 rounded-lg hover:bg-white/10 transition-all group">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-gray-300 mb-6">{service.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-300">
                        <span className="text-green-400 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-blue-400 font-semibold">{service.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 px-4 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                My Development Process
              </h2>
              <p className="text-gray-300 text-lg">
                A proven methodology that ensures successful project delivery
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {process.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Let's discuss your requirements and create something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold text-lg"
              >
                Get Free Quote
              </a>
              <a
                href="/projects"
                className="border border-white/20 text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-all font-semibold text-lg"
              >
                View My Work
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}