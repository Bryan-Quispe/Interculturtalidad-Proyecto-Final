const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const CategoriaAnimal = {
  PERRO: 'PERRO',
  GATO: 'GATO',
  CONEJO: 'CONEJO',
};

async function main() {
  // ── 1. Crear usuario ADMIN ──
  const adminPassword = await bcrypt.hash('Admin1234', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mascotas3d.com' },
    update: {
      name: 'Administrador',
      password: adminPassword,
      role: 'ADMIN',
    },
    create: {
      email: 'admin@mascotas3d.com',
      name: 'Administrador',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // ── 2. Crear usuario USER ──
  const userPassword = await bcrypt.hash('Demo1234', 10);
  const user = await prisma.user.upsert({
    where: { email: 'rquisper406@gmail.com' },
    update: {
      name: 'Bryan Quispe',
      password: userPassword,
      role: 'USER',
    },
    create: {
      email: 'rquisper406@gmail.com',
      name: 'Bryan Quispe',
      password: userPassword,
      role: 'USER',
    },
  });

  // ── 3. Crear Modelo3D para el ADMIN ──
  // Buscar si ya existe un modelo con ese nombre para este admin
  let modelo = await prisma.modelo3D.findFirst({
    where: {
      nombre: 'Perro Husky',
      usuarioId: admin.id,
    },
  });

  if (!modelo) {
    modelo = await prisma.modelo3D.create({
      data: {
        nombre: 'Perro Husky',
        categoria: CategoriaAnimal.PERRO,
        raza: 'Husky Siberiano',
        descripcion: 'Modelo 3D realista de un perro husky',
        color: '#8B4513',
        isPublico: true,
        usuarioId: admin.id,
        // Antes apuntaba al .obj del Australian Cattle Dog, que está excluido
        // del repositorio en backend/Modelos/.gitignore (rutas demasiado
        // largas para Windows). Al no viajar en el clon, el modelo daba 404 en
        // el servidor. Se usa un .glb que sí está versionado.
        archivo: {
          create: {
            filename: 'Perro Husky.glb',
            path: '/modelos/Perro/Perro Husky.glb',
            mimetype: 'model/gltf-binary',
            tamano: 16117544,
          },
        },
        transformaciones: {
          create: {
            escalaX: 1,
            escalaY: 1,
            escalaZ: 1,
            rotacionX: 0,
            rotacionY: 0,
            rotacionZ: 0,
            posicionX: 0,
            posicionY: 0,
            posicionZ: 0,
          },
        },
      },
      include: {
        archivo: true,
        transformaciones: true,
      },
    });
  }

  // ── 3.5. Crear Modelo3D GLB para el ADMIN ──
  let modeloGlb = await prisma.modelo3D.findFirst({
    where: {
      nombre: 'Gato tricolor',
      usuarioId: admin.id,
    },
  });

  if (!modeloGlb) {
    modeloGlb = await prisma.modelo3D.create({
      data: {
        nombre: 'Gato tricolor',
        categoria: CategoriaAnimal.GATO,
        raza: 'Desconocida',
        descripcion: 'Modelo 3D de un gato tricolor',
        color: '#10b981',
        isPublico: true,
        usuarioId: admin.id,
        archivo: {
          create: {
            filename: 'Meshy_AI_a_highly_detailed_3D__0617045051_texture.glb',
            path: '/modelos/Gato/Meshy_AI_a_highly_detailed_3D__0617045051_texture.glb',
            mimetype: 'model/gltf-binary',
            tamano: 2048000,
          },
        },
        transformaciones: {
          create: {
            escalaX: 1,
            escalaY: 1,
            escalaZ: 1,
            rotacionX: 0,
            rotacionY: 0,
            rotacionZ: 0,
            posicionX: 0,
            posicionY: 0,
            posicionZ: 0,
          },
        },
      },
      include: {
        archivo: true,
        transformaciones: true,
      },
    });
  }

  // ── 3.6. Crear Modelo3D GLB 2 para el ADMIN ──
  let modeloGlb2 = await prisma.modelo3D.findFirst({
    where: { nombre: 'Conejo café', usuarioId: admin.id },
  });

  if (!modeloGlb2) {
    await prisma.modelo3D.create({
      data: {
        nombre: 'Conejo café',
        categoria: CategoriaAnimal.CONEJO,
        raza: 'Desconocida',
        descripcion: 'Modelo 3D de un conejo café',
        color: '#f59e0b',
        isPublico: true,
        usuarioId: admin.id,
        archivo: {
          create: {
            filename: 'Meshy_AI_a_highly_detailed_3D__0617045551_texture.glb',
            path: '/modelos/Conejos/Meshy_AI_a_highly_detailed_3D__0617045551_texture.glb',
            mimetype: 'model/gltf-binary',
            tamano: 2048000,
          },
        },
        transformaciones: {
          create: {
            escalaX: 1, escalaY: 1, escalaZ: 1,
            rotacionX: 0, rotacionY: 0, rotacionZ: 0,
            posicionX: 0, posicionY: 0, posicionZ: 0,
          },
        },
      },
    });
  }

  // ── 3.7. Crear Modelo3D GLB 3 para el ADMIN ──
  let modeloGlb3 = await prisma.modelo3D.findFirst({
    where: { nombre: 'Perro café', usuarioId: admin.id },
  });

  if (!modeloGlb3) {
    await prisma.modelo3D.create({
      data: {
        nombre: 'Perro café',
        categoria: CategoriaAnimal.PERRO,
        raza: 'Desconocida',
        descripcion: 'Modelo 3D de un perro café',
        color: '#3b82f6',
        isPublico: true,
        usuarioId: admin.id,
        archivo: {
          create: {
            filename: 'Meshy_AI_a_highly_detailed_3D__0617050059_texture.glb',
            path: '/modelos/Perro/Meshy_AI_a_highly_detailed_3D__0617050059_texture.glb',
            mimetype: 'model/gltf-binary',
            tamano: 2048000,
          },
        },
        transformaciones: {
          create: {
            escalaX: 1, escalaY: 1, escalaZ: 1,
            rotacionX: 0, rotacionY: 0, rotacionZ: 0,
            posicionX: 0, posicionY: 0, posicionZ: 0,
          },
        },
      },
    });
  }

  // ── 4. Crear los 4 animales para el USER ──
  const animals = [
    {
      slug: 'perro-toby-demo',
      nombre: 'Toby',
      categoria: CategoriaAnimal.PERRO,
      descripcion: 'Perro familiar, activo y muy sociable.',
      raza: 'Perro mestizo',
      caracteristicas: {
        tamano: 'Mediano',
        color: 'Café claro',
        habitat: 'Casa con patio',
      },
      assignModelo: true, // Toby recibe el modelo 3D
    },
    {
      slug: 'perro-luna-demo',
      nombre: 'Luna',
      categoria: CategoriaAnimal.PERRO,
      descripcion: 'Perra tranquila, ideal para compañía en interiores.',
      raza: 'Labrador',
      caracteristicas: {
        tamano: 'Grande',
        color: 'Dorado',
        habitat: 'Apartamento amplio',
      },
    },
    {
      slug: 'gato-mishi-demo',
      nombre: 'Mishi',
      categoria: CategoriaAnimal.GATO,
      descripcion: 'Gato curioso y elegante, siempre atento a su entorno.',
      raza: 'Gato doméstico',
      caracteristicas: {
        tamano: 'Pequeño',
        color: 'Negro con blanco',
        habitat: 'Hogar interior',
      },
    },
    {
      slug: 'conejo-copito-demo',
      nombre: 'Copito',
      categoria: CategoriaAnimal.CONEJO,
      descripcion: 'Conejo dócil y muy tranquilo para ambientes familiares.',
      raza: 'Conejo enano',
      caracteristicas: {
        tamano: 'Pequeño',
        color: 'Blanco',
        habitat: 'Jaula amplia y espacio supervisado',
      },
    },
  ];

  for (const item of animals) {
    const animal = await prisma.animal.upsert({
      where: { slug: item.slug },
      update: {
        nombre: item.nombre,
        descripcion: item.descripcion,
        raza: item.raza,
        categoria: item.categoria,
        usuarioId: user.id,
        ...(item.assignModelo && modelo ? { modeloId: modelo.id } : {}),
      },
      create: {
        slug: item.slug,
        nombre: item.nombre,
        descripcion: item.descripcion,
        raza: item.raza,
        categoria: item.categoria,
        usuarioId: user.id,
        ...(item.assignModelo && modelo ? { modeloId: modelo.id } : {}),
      },
    });

    await prisma.caracteristicasAnimal.upsert({
      where: { animalId: animal.id },
      update: {
        tamano: item.caracteristicas.tamano,
        color: item.caracteristicas.color,
        habitat: item.caracteristicas.habitat,
      },
      create: {
        tamano: item.caracteristicas.tamano,
        color: item.caracteristicas.color,
        habitat: item.caracteristicas.habitat,
        animalId: animal.id,
      },
    });
  }

  // ── 5. Log de credenciales ──
  console.log('\n========================================');
  console.log('  SEED COMPLETADO EXITOSAMENTE');
  console.log('========================================');
  console.log('\n  Credenciales de acceso:');
  console.log('  ─────────────────────────────────────');
  console.log(`  ADMIN: admin@mascotas3d.com / Admin1234`);
  console.log(`  USER:  rquisper406@gmail.com / Demo1234`);
  console.log('  ─────────────────────────────────────');
  console.log(`\n  Animales creados: ${animals.length}`);
  console.log(`  Modelo 3D: ${modelo.nombre} (ID: ${modelo.id})`);
  console.log('========================================\n');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
