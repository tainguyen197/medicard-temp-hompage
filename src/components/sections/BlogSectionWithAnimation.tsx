import React from "react";
import BlogSection from "@/components/BlogSection";
import AnimatedSection from "@/components/AnimatedSection";

const BlogSectionWithAnimation = async ({
  locale = "vi",
}: {
  locale?: string;
}) => {
  return (
    <AnimatedSection animation="slideUp" delay={0.1} duration={0.6}>
      <BlogSection locale={locale} />
    </AnimatedSection>
  );
};

export default BlogSectionWithAnimation;
