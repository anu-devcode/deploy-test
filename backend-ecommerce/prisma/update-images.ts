import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updateImages() {
    const imageMap: Record<string, string[]> = {
        'premium-teff-white': ['/wheat.png'],
        'red-teff': ['/wheat.png'],
        'ethiopian-lentils': ['/lentils.png'],
        'berbere-spice-mix': ['/harvest-hero.png'],
        'mitmita-pepper': ['/harvest-hero.png'],
        'ethiopian-sesame': ['/sesame.png'],
        'niger-seed-nug': ['/sesame.png'],
        'chickpeas-shimbra': ['/lentils.png'],
    };

    for (const [slug, images] of Object.entries(imageMap)) {
        try {
            await prisma.product.update({
                where: { slug },
                data: { images }
            });
            console.log('Updated:', slug);
        } catch (e) {
            console.log('Skipped:', slug);
        }
    }

    await prisma.$disconnect();
    console.log('Done!');
}

updateImages();
