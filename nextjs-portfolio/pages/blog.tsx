import Layout from '../components/Layout';

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: 'Building Scalable Web Applications with Next.js',
      excerpt: 'Learn how to create performant and scalable web applications using Next.js and modern development practices.',
      date: '2024-01-15',
      readTime: '5 min read',
      category: 'Web Development',
      image: '/api/placeholder/400/250'
    },
    {
      id: 2,
      title: 'Flutter vs React Native: A Developer\'s Perspective',
      excerpt: 'Comparing two popular cross-platform mobile development frameworks from a practical standpoint.',
      date: '2024-01-10',
      readTime: '8 min read',
      category: 'Mobile Development',
      image: '/api/placeholder/400/250'
    },
    {
      id: 3,
      title: 'The Future of Full-Stack Development',
      excerpt: 'Exploring emerging trends and technologies that are shaping the future of full-stack development.',
      date: '2024-01-05',
      readTime: '6 min read',
      category: 'Technology',
      image: '/api/placeholder/400/250'
    }
  ];

  const categories = ['All', 'Web Development', 'Mobile Development', 'Technology', 'Career'];

  return (
    <Layout title="Blog - Ephraim Umunnakwe">
      {/* Hero Section */}
      <section className="mt-16 py-32 px-4 bg-secondary dark:bg-primary border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black tracking-tightest text-neutral-900 dark:text-secondary mb-8 uppercase leading-tight">
            Journal<br />Entry
          </h1>
          <p className="text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl font-medium leading-relaxed">
            Thoughts on architectural engineering, design systems, and the future
            of high-performance digital products.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 bg-neutral-50 dark:bg-secondary border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-xs font-black uppercase tracking-widest text-neutral-400 mr-4">Filter By</span>
            {categories.map((category) => (
              <button
                key={category}
                className="px-8 py-3 bg-white dark:bg-primary border-2 border-neutral-900 dark:border-neutral-800 text-neutral-900 dark:text-white font-black uppercase tracking-widest text-xs hover:bg-neutral-900 hover:text-white dark:hover:bg-accent transition-all"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-32 px-4 bg-secondary dark:bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts.map((post) => (
              <article key={post.id} className="border-4 border-neutral-900 dark:border-neutral-800 flex flex-col hover:bg-neutral-900 hover:text-white dark:hover:bg-secondary dark:hover:text-primary transition-all duration-300 group">
                <div className="h-64 bg-neutral-100 dark:bg-neutral-900 relative grayscale group-hover:grayscale-0 transition-all duration-500 overflow-hidden border-b-4 border-neutral-900 dark:border-neutral-800">
                  <img src={post.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-0 right-0 p-4">
                    <span className="bg-accent text-white px-4 py-2 font-black uppercase tracking-widest text-[10px]">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-10 flex flex-col flex-grow">
                  <div className="flex items-center text-xs font-black uppercase tracking-tightest mb-6 opacity-60">
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <span className="mx-3">/</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-3xl font-black uppercase tracking-tight mb-6 leading-none">
                    {post.title}
                  </h3>

                  <p className="text-neutral-600 dark:text-neutral-400 font-medium text-lg mb-10 line-clamp-3 group-hover:text-neutral-300 transition-colors leading-relaxed">
                    {post.excerpt}
                  </p>

                  <button className="text-accent font-black uppercase tracking-widest text-sm text-left mt-auto group-hover:text-white transition-colors">
                    Read Report <span className="ml-2">→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-40 px-4 bg-neutral-50 dark:bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-neutral-900 dark:text-white mb-8 uppercase leading-tight">
                Get Daily<br />Insights
              </h2>
              <p className="text-2xl text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">
                Join our architectural network for technical deep-dives
                delivered straight to your inbox.
              </p>
            </div>
            <div className="bg-white dark:bg-primary p-12 border-4 border-neutral-900 dark:border-neutral-800">
              <div className="flex flex-col gap-6">
                <input
                  type="email"
                  placeholder="USER@DOMAIN.COM"
                  className="w-full bg-neutral-100 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-300 dark:placeholder-neutral-700 px-6 py-5 focus:outline-none focus:border-accent font-bold transition-all"
                />
                <button className="w-full bg-neutral-900 dark:bg-accent text-white py-6 border-4 border-neutral-900 dark:border-accent font-black text-xl uppercase tracking-widest hover:bg-transparent hover:text-neutral-900 dark:hover:text-white transition-all">
                  Join Network
                </button>
              </div>
              <p className="mt-6 text-xs font-black uppercase tracking-widest text-neutral-400 text-center">
                Secure Transmission Guaranteed. No Spam.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}