import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Helper function to generate a slug from a title
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

// Helper function to generate random date within the past year
function randomDate(startDate: Date, endDate: Date) {
  return new Date(
    startDate.getTime() +
      Math.random() * (endDate.getTime() - startDate.getTime())
  );
}

async function main() {
  console.log(`Start seeding posts...`);

  // Get admin user for authorship
  const user = await prisma.user.findFirst({
    where: { role: "EDITOR" },
  });

  if (!user) {
    console.error("No editor user found. Please run the main seed script first.");
    return;
  }

  // Get all categories
  const categories = await prisma.category.findMany();
  if (categories.length === 0) {
    console.error("No categories found. Please run the main seed script first.");
    return;
  }

  // Define post statuses
  const statuses = ["DRAFT", "PUBLISHED", "PENDING_REVIEW", "SCHEDULED"];
  
  // Example image URLs
  const imageUrls = [
    "https://source.unsplash.com/random/800x600/?health",
    "https://source.unsplash.com/random/800x600/?wellness",
    "https://source.unsplash.com/random/800x600/?therapy",
    "https://source.unsplash.com/random/800x600/?medicine",
    "https://source.unsplash.com/random/800x600/?healthcare",
    "https://source.unsplash.com/random/800x600/?doctor",
    "https://source.unsplash.com/random/800x600/?hospital",
    "https://source.unsplash.com/random/800x600/?mental-health",
    null, // Some posts won't have featured images
  ];

  // Generate 20 posts
  for (let i = 0; i < 20; i++) {
    const title = faker.lorem.sentence();
    const slug = slugify(title);
    const content = faker.lorem.paragraphs(5);
    const excerpt = faker.lorem.paragraph();
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Randomly assign 1-2 categories
    const categoryCount = Math.floor(Math.random() * 2) + 1;
    const postCategories: { categoryId: string }[] = [];
    
    for (let j = 0; j < categoryCount; j++) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      // Prevent duplicate categories
      if (!postCategories.some(c => c.categoryId === randomCategory.id)) {
        postCategories.push({ categoryId: randomCategory.id });
      }
    }
    
    // Set publishedAt date based on status
    let publishedAt: Date | null = null;
    if (status === "PUBLISHED") {
      publishedAt = randomDate(new Date(new Date().setFullYear(new Date().getFullYear() - 1)), new Date());
    } else if (status === "SCHEDULED") {
      publishedAt = randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 3)));
    }

    // Randomly select a featured image (or null)
    const featuredImage = imageUrls[Math.floor(Math.random() * imageUrls.length)];
    
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        status,
        publishedAt,
        featuredImage,
        authorId: user.id,
        categories: {
          create: postCategories,
        },
      },
    });
    
    console.log(`Created post with id: ${post.id} and title: ${post.title}`);
  }

  console.log(`Seeding posts finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 