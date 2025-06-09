import React from "react";
import BlogSection from "@/components/BlogSection";
import AnimatedSection from "@/components/AnimatedSection";

const BlogSectionWithAnimation = () => {
  return (
    <AnimatedSection animation="slideUp" delay={0.1} duration={0.6}>
      <BlogSection />
    </AnimatedSection>
  );
};

export default BlogSectionWithAnimation;
