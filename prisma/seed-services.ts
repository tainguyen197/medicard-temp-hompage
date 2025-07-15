import { PrismaClient } from '@prisma/client';
import { defaultServices } from '../src/data/services';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding Services ...`);
  
  // Create services based on the default services data
  for (const service of defaultServices) {
    const serviceData = {
      slug: service.id,
      title: service.title,
      titleEn: service.titleEn || null,
      description: service.description,
      descriptionEn: service.descriptionEn || null,
      shortDescription: service.details,
      shortDescriptionEn: service.detailsEn || null,
      status: 'PUBLISHED',
      showOnHomepage: service.featured || false,
      metaTitle: service.title,
      metaTitleEn: service.titleEn || null,
      metaDescription: service.description.substring(0, 160), // Limit meta description to 160 chars
      metaDescriptionEn: service.descriptionEn ? service.descriptionEn.substring(0, 160) : null,
      keywords: service.id.replace(/-/g, ', '),
      enKeywords: service.id.replace(/-/g, ', '),
    };
    
    const created = await prisma.service.upsert({
      where: { slug: service.id },
      update: serviceData,
      create: serviceData,
    });
    
    console.log(`Created/updated service: ${created.title} (id: ${created.id})`);
  }
  
  console.log(`Services seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });