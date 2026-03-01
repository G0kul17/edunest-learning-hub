import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlowCard from "@/components/ui/GlowCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { mockForumPosts, mockCourses } from "@/data/mockData";
import { MessageSquare, ThumbsUp, CheckCircle, Search, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function Forums() {
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const filteredPosts = selectedCourse === "all"
    ? mockForumPosts
    : mockForumPosts.filter((p) => p.courseId === selectedCourse);

  const post = selectedPost ? mockForumPosts.find((p) => p.id === selectedPost) : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold text-foreground">Discussion Forums</h1>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
            <Plus className="w-4 h-4" /> New Post
          </button>
        </div>

        {/* Course filters */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCourse("all")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCourse === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            }`}
          >
            All Forums
          </button>
          {mockCourses.filter(c => c.status === "active").map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourse(course.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCourse === course.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {course.title}
            </button>
          ))}
        </div>

        {/* Post detail or list */}
        {post ? (
          <ScrollReveal>
            <div className="space-y-4">
              <button onClick={() => setSelectedPost(null)} className="text-xs text-muted-foreground hover:text-foreground">
                ← Back to posts
              </button>
              <GlowCard glowColor="blue">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary">{post.authorName[0]}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-heading font-semibold text-foreground">{post.title}</h2>
                    <p className="text-xs text-muted-foreground mt-1">{post.authorName} · {new Date(post.createdAt).toLocaleDateString()}</p>
                    <p className="text-sm text-foreground mt-3 whitespace-pre-line">{post.body}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                        <ThumbsUp className="w-4 h-4" /> {post.likes}
                      </button>
                      <div className="flex gap-1">
                        {post.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </GlowCard>

              {/* Replies */}
              <div className="space-y-3 ml-8">
                {post.replies.map((reply) => (
                  <motion.div
                    key={reply.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`glass rounded-xl p-4 ${reply.isSolution ? "border border-success/30" : ""}`}
                  >
                    {reply.isSolution && (
                      <span className="text-xs text-success flex items-center gap-1 mb-2">
                        <CheckCircle className="w-3 h-3" /> Solution
                      </span>
                    )}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-foreground">{reply.authorName[0]}</span>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{reply.authorName} · {new Date(reply.createdAt).toLocaleDateString()}</p>
                        <p className="text-sm text-foreground mt-1 whitespace-pre-line">{reply.body}</p>
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mt-2">
                          <ThumbsUp className="w-3 h-3" /> {reply.likes}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Reply input */}
              <div className="ml-8 flex gap-2">
                <input
                  placeholder="Write a reply..."
                  className="flex-1 px-4 py-2.5 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
                <button className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
                  Reply
                </button>
              </div>
            </div>
          </ScrollReveal>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 0.05}>
                <div
                  onClick={() => setSelectedPost(post.id)}
                  className="glass rounded-xl p-4 hover:border-primary/20 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary">{post.authorName[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground truncate">{post.title}</h3>
                        {post.solved && <CheckCircle className="w-4 h-4 text-success shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{post.authorName} · {new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MessageSquare className="w-3 h-3" /> {post.replies.length}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ThumbsUp className="w-3 h-3" /> {post.likes}
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
