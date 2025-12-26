import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { blogPosts } from '@/data/blogPosts';

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-24 text-center">
          <h1 className="text-3xl font-bold text-foreground">Post Not Found</h1>
          <p className="mt-4 text-muted-foreground">
            The blog post you're looking for doesn't exist.
          </p>
          <Link to="/blog">
            <Button className="mt-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  const currentIndex = blogPosts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Image */}
        <div className="relative h-64 md:h-96">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        {/* Article Content */}
        <article className="container relative -mt-24 max-w-4xl">
          <div className="rounded-xl border border-border bg-card p-6 shadow-lg md:p-10">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4">
              <Badge variant="secondary">{post.category}</Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-6 text-3xl font-bold text-foreground md:text-4xl">
              {post.title}
            </h1>

            {/* Author */}
            <div className="mt-6 flex items-center justify-between border-b border-border pb-6">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">{post.author.name}</p>
                  <p className="text-sm text-muted-foreground">Author</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg mt-8 max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground">
              {post.content.split('\n').map((line, index) => {
                if (line.startsWith('## ')) {
                  return (
                    <h2 key={index} className="mt-8 text-2xl font-bold text-foreground">
                      {line.replace('## ', '')}
                    </h2>
                  );
                }
                if (line.startsWith('### ')) {
                  return (
                    <h3 key={index} className="mt-6 text-xl font-semibold text-foreground">
                      {line.replace('### ', '')}
                    </h3>
                  );
                }
                if (line.startsWith('- **')) {
                  const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
                  if (match) {
                    return (
                      <li key={index} className="ml-4">
                        <strong className="text-foreground">{match[1]}:</strong> {match[2]}
                      </li>
                    );
                  }
                }
                if (line.startsWith('- ')) {
                  return (
                    <li key={index} className="ml-4 text-muted-foreground">
                      {line.replace('- ', '')}
                    </li>
                  );
                }
                if (line.trim()) {
                  return (
                    <p key={index} className="text-muted-foreground">
                      {line}
                    </p>
                  );
                }
                return null;
              })}
            </div>

            {/* Navigation */}
            <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:justify-between">
              {prevPost ? (
                <Link
                  to={`/blog/${prevPost.slug}`}
                  className="group flex items-center gap-2 text-muted-foreground hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  <span className="text-sm">Previous: {prevPost.title.slice(0, 30)}...</span>
                </Link>
              ) : (
                <div />
              )}
              {nextPost && (
                <Link
                  to={`/blog/${nextPost.slug}`}
                  className="group flex items-center gap-2 text-muted-foreground hover:text-primary sm:text-right"
                >
                  <span className="text-sm">Next: {nextPost.title.slice(0, 30)}...</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="container max-w-4xl py-16">
            <h2 className="text-2xl font-bold text-foreground">Related Articles</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {relatedPost.category}
                    </Badge>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground">{relatedPost.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
