import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql, { schema });

const translations = {
  "the man": {
    Spanish: "el hombre",
    Hindi: "आदमी",
    Marathi: "पुरुष",
    Telugu: "మనిషి",
    Tamil: "ஆண்",
    Gujarati: "માણસ",
    Urdu: "آدمی",
    Kannada: "ಮನುಷ್ಯ",
    Odia: "ମନୁଷ୍ୟ",
    Malayalam: "മനുഷ്യൻ",
  },
  "the woman": {
    Spanish: "la mujer",
    Hindi: "औरत",
    Marathi: "स्त्री",
    Telugu: "మహిళ",
    Tamil: "பெண்",
    Gujarati: "મહિલા",
    Urdu: "عورت",
    Kannada: "ಮಹಿಳೆ",
    Odia: "ମହିଳା",
    Malayalam: "സ്ത്രീ",
  },
  "the boy": {
    Spanish: "el chico",
    Hindi: "लड़का",
    Marathi: "मुलगा",
    Telugu: "బాలుడు",
    Tamil: "சிறுவன்",
    Gujarati: "છોકરો",
    Urdu: "لڑکا",
    Kannada: "ಹುಡುಗ",
    Odia: "ବାଳକ",
    Malayalam: "ബാലൻ",
  },
  "the zombie": {
    Spanish: "el zombie",
    Hindi: "ज़ॉम्बी",
    Marathi: "झोंबी",
    Telugu: "జాంబీ",
    Tamil: "ஜாம்பி",
    Gujarati: "ઝોમ્બી",
    Urdu: "زومبی",
    Kannada: "ಜೋಂಬಿ",
    Odia: "ଜୋମ୍ବି",
    Malayalam: "സോംബി",
  },
  "the robot": {
    Spanish: "el robot",
    Hindi: "रोबोट",
    Marathi: "रोबोट",
    Telugu: "రోబోట్",
    Tamil: "ரோபோ",
    Gujarati: "રોબોટ",
    Urdu: "روبوٹ",
    Kannada: "ರೋಬೋಟ್",
    Odia: "ରୋବୋଟ",
    Malayalam: "റോബോട്ട്",
  },
  "the girl": {
    Spanish: "la nina",
    Hindi: "लड़की",
    Marathi: "मुलगी",
    Telugu: "బాలిక",
    Tamil: "சிறுமி",
    Gujarati: "છોકરી",
    Urdu: "لڑکی",
    Kannada: "ಹುಡುಗಿ",
    Odia: "ବାଳିକା",
    Malayalam: "പെൺകുട്ടി",
  },
};

const getTranslation = (
  english: keyof typeof translations,
  language: string
) => {
  return (
    translations[english]?.[
      language as keyof (typeof translations)[typeof english]
    ] || english
  );
};

const main = async () => {
  try {
    console.log("Seeding database");

    // Delete all existing data
    await Promise.all([
      db.delete(schema.userProgress),
      db.delete(schema.challenges),
      db.delete(schema.units),
      db.delete(schema.lessons),
      db.delete(schema.courses),
      db.delete(schema.challengeOptions),
      db.delete(schema.userSubscription),
    ]);

    // Insert courses
    const courses = await db
      .insert(schema.courses)
      .values([
        { title: "Spanish", imageSrc: "/es.svg" },
        { title: "Hindi", imageSrc: "/hr.svg" },
        { title: "Marathi", imageSrc: "/hr.svg" },
        { title: "Telugu", imageSrc: "/hr.svg" },
        { title: "Tamil", imageSrc: "/hr.svg" },
        { title: "Gujarati", imageSrc: "/hr.svg" },
        { title: "Urdu", imageSrc: "/hr.svg" },
        { title: "Kannada", imageSrc: "/hr.svg" },
        { title: "Odia", imageSrc: "/hr.svg" },
        { title: "Malayalam", imageSrc: "/hr.svg" },
      ])
      .returning();

    // For each course, insert units
    for (const course of courses) {
      const units = await db
        .insert(schema.units)
        .values([
          {
            courseId: course.id,
            title: "Unit 1",
            description: `Learn the basics of ${course.title}`,
            order: 1,
          },
          {
            courseId: course.id,
            title: "Unit 2",
            description: `Learn intermediate ${course.title}`,
            order: 2,
          },
        ])
        .returning();

      // For each unit, insert lessons
      for (const unit of units) {
        const lessons = await db
          .insert(schema.lessons)
          .values([
            { unitId: unit.id, title: "Nouns", order: 1 },
            { unitId: unit.id, title: "Verbs", order: 2 },
            { unitId: unit.id, title: "Adjectives", order: 3 },
            { unitId: unit.id, title: "Phrases", order: 4 },
            { unitId: unit.id, title: "Sentences", order: 5 },
          ])
          .returning();

        // For each lesson, insert challenges
        for (const lesson of lessons) {
          const challenges = await db
            .insert(schema.challenges)
            .values([
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the man"?',
                order: 1,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the woman"?',
                order: 2,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the boy"?',
                order: 3,
              },
              {
                lessonId: lesson.id,
                type: "ASSIST",
                question: '"the man"',
                order: 4,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the zombie"?',
                order: 5,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the robot"?',
                order: 6,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the girl"?',
                order: 7,
              },
              {
                lessonId: lesson.id,
                type: "ASSIST",
                question: '"the zombie"',
                order: 8,
              },
            ])
            .returning();

          // For each challenge, insert challenge options
          for (const challenge of challenges) {
            const isSpanish = course.title === "Spanish";

            if (challenge.order === 1) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: getTranslation("the man", course.title),
                  imageSrc: "/man.svg",
                  audioSrc: isSpanish ? "/es_man.mp3" : null,
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: getTranslation("the woman", course.title),
                  imageSrc: "/woman.svg",
                  audioSrc: isSpanish ? "/es_woman.mp3" : null,
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: getTranslation("the boy", course.title),
                  imageSrc: "/boy.svg",
                  audioSrc: isSpanish ? "/es_boy.mp3" : null,
                },
              ]);
            }

            if (challenge.order === 2) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: getTranslation("the woman", course.title),
                  imageSrc: "/woman.svg",
                  audioSrc: isSpanish ? "/es_woman.mp3" : null,
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: getTranslation("the boy", course.title),
                  imageSrc: "/boy.svg",
                  audioSrc: isSpanish ? "/es_boy.mp3" : null,
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: getTranslation("the man", course.title),
                  imageSrc: "/man.svg",
                  audioSrc: isSpanish ? "/es_man.mp3" : null,
                },
              ]);
            }

            if (challenge.order === 3) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: getTranslation("the woman", course.title),
                  imageSrc: "/woman.svg",
                  audioSrc: isSpanish ? "/es_woman.mp3" : null,
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: getTranslation("the man", course.title),
                  imageSrc: "/man.svg",
                  audioSrc: isSpanish ? "/es_man.mp3" : null,
                },
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: getTranslation("the boy", course.title),
                  imageSrc: "/boy.svg",
                  audioSrc: isSpanish ? "/es_boy.mp3" : null,
                },
              ]);
            }

            if (challenge.order === 4) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: getTranslation("the woman", course.title),
                  audioSrc: isSpanish ? "/es_woman.mp3" : null,
                },
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: getTranslation("the man", course.title),
                  audioSrc: isSpanish ? "/es_man.mp3" : null,
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: getTranslation("the boy", course.title),
                  audioSrc: isSpanish ? "/es_boy.mp3" : null,
                },
              ]);
            }

            if (challenge.order === 5) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: getTranslation("the man", course.title),
                  imageSrc: "/man.svg",
                  audioSrc: isSpanish ? "/es_man.mp3" : null,
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: getTranslation("the woman", course.title),
                  imageSrc: "/woman.svg",
                  audioSrc: isSpanish ? "/es_woman.mp3" : null,
                },
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: getTranslation("the zombie", course.title),
                  imageSrc: "/zombie.svg",
                  audioSrc: isSpanish ? "/es_zombie.mp3" : null,
                },
              ]);
            }

            if (challenge.order === 6) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: getTranslation("the robot", course.title),
                  imageSrc: "/robot.svg",
                  audioSrc: isSpanish ? "/es_robot.mp3" : null,
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: getTranslation("the zombie", course.title),
                  imageSrc: "/zombie.svg",
                  audioSrc: isSpanish ? "/es_zombie.mp3" : null,
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: getTranslation("the boy", course.title),
                  imageSrc: "/boy.svg",
                  audioSrc: isSpanish ? "/es_boy.mp3" : null,
                },
              ]);
            }

            if (challenge.order === 7) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: getTranslation("the girl", course.title),
                  imageSrc: "/girl.svg",
                  audioSrc: isSpanish ? "/es_girl.mp3" : null,
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: getTranslation("the zombie", course.title),
                  imageSrc: "/zombie.svg",
                  audioSrc: isSpanish ? "/es_zombie.mp3" : null,
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: getTranslation("the man", course.title),
                  imageSrc: "/man.svg",
                  audioSrc: isSpanish ? "/es_man.mp3" : null,
                },
              ]);
            }

            if (challenge.order === 8) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: getTranslation("the woman", course.title),
                  audioSrc: isSpanish ? "/es_woman.mp3" : null,
                },
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: getTranslation("the zombie", course.title),
                  audioSrc: isSpanish ? "/es_zombie.mp3" : null,
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: getTranslation("the boy", course.title),
                  audioSrc: isSpanish ? "/es_boy.mp3" : null,
                },
              ]);
            }
          }
        }
      }
    }
    console.log("Database seeded successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

void main();
