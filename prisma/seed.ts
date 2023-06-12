import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const driver = fs.readFileSync(
  path.join(__dirname, '../data/driversResult.json'),
  'utf8',
);
const teams = fs.readFileSync(
  path.join(__dirname, '../data/teamsResult.json'),
  'utf8',
);

const races = fs.readFileSync(
  path.join(__dirname, '../data/racesResult.json'),
  'utf8',
);

const driverJson = JSON.parse(driver);
const teamsJson = JSON.parse(teams);
const racesData = JSON.parse(races).flat();

const driverData = [...driverJson].map((driver) => driver.driversResult).flat();
const teamData = [...teamsJson].map((team) => team.teamResult).flat();

const prisma = new PrismaClient();

console.log('Seeding data...');

async function main() {
  console.log('Seeding teams....');
  for (let i = 0; i < teamData.length; i++) {
    const team = teamData[i];
    try {
      if (Object.keys(team).length !== 0) {
        await prisma.team.upsert({
          where: { name: team.team },
          update: {},
          create: {
            name: team.team,
          },
        });
        console.log(`Creating team: ${team.team}`);
      }
    } catch (error) {
      console.log(error);
      console.log(`Error creating team ${team.team}`);
    }
  }

  console.log('Seeding drivers....');
  for (let i = 0; i < driverData.length; i++) {
    const driver = driverData[i];
    try {
      if (Object.keys(driver).length !== 0) {
        await prisma.driver.upsert({
          where: { name: driver.driver },
          update: {
            teams: {
              connect: {
                name: driver.team,
              },
            },
          },
          create: {
            name: driver.driver,
            nationality: driver.nationality,
            teams: {
              connect: {
                name: driver.team,
              },
            },
          },
        });
        console.log(`Creating driver: ${driver.driver}: ${driver.team}`);
      }
    } catch (error) {
      console.log(error);
      console.log(`Error creating driver ${driver.driver}: ${driver.team}`);
    }
  }

  console.log('Seeding races....');
  for (let i = 0; i < racesData.length; i++) {
    const row = racesData[i];
    try {
      if (Object.keys(row).length !== 0) {
        const { season, grandPrix, date, title, ranking } = row;
        await prisma.season.upsert({
          where: { name: season },
          update: {
            races: {
              connectOrCreate: {
                where: {
                  title: title,
                },
                create: {
                  title: title,
                  grandPrix: grandPrix,
                  date: date,
                },
              },
            },
          },
          create: {
            name: season,
          },
          select: {
            races: {
              select: {
                id: true,
              },
            },
          },
        });

        for (let j = 0; j < ranking.length; j++) {
          const rankRow = ranking[j];

          await prisma.ranking.create({
            data: {
              position: rankRow.position,
              points: rankRow.points,
              driver: {
                connect: {
                  name: rankRow.driver,
                },
              },
              race: {
                connect: {
                  title: title,
                },
              },
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
      console.log(
        `Error with ${row.title} - ${row.grandPrix} - ${row.season} - ${row.date} - ${row.ranking}`,
      );
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
