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
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              My Blog
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Thoughts, tutorials, and insights about software development, technology trends, 
              and my journey as a developer.
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-6 py-2 bg-white/10 text-gray-300 rounded-full hover:bg-white/20 hover:text-white transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all group">
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-gray-400 text-sm mb-3">
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <button className="text-blue-400 hover:text-blue-300 font-medium">
                      Read More →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Stay Updated
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Subscribe to get notified about new blog posts and updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}