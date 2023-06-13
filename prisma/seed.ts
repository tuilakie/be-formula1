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

console.log('drviers', driverData[0]);
console.log('teams', teamData[0]);
console.log('races', racesData[0]);

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
          update: {},
          create: {
            name: driver.driver,
            nationality: driver.nationality,
          },
        });
        console.log(`Creating driver: ${driver.driver}: ${driver.team}`);
      }
    } catch (error) {
      console.log(error);
      console.log(`Error creating driver ${driver.driver}: ${driver.team}`);
    }
  }

  console.log('Seeding season + races + rank ....');
  for (let i = 0; i < racesData.length; i++) {
    const row = racesData[i];
    try {
      if (Object.keys(row).length !== 0) {
        const { season, grandPrix, date, circuit, title, ranking } = row;

        for (let j = 0; j < ranking.length; j++) {
          const rankRow = ranking[j];
          await prisma.season.upsert({
            where: { name: season },
            update: {},
            create: {
              name: season,
            },
          });

          await prisma.driverTeamSeason.upsert({
            where: {
              driverName_teamName_seasonName: {
                driverName: rankRow.driver,
                teamName: rankRow.team,
                seasonName: season,
              },
            },
            update: {
              driver: {
                connectOrCreate: {
                  where: {
                    name: rankRow.driver,
                  },
                  create: {
                    name: rankRow.driver,
                    nationality: 'unknown',
                  },
                },
              },
              team: {
                connectOrCreate: {
                  where: {
                    name: rankRow.team,
                  },
                  create: {
                    name: rankRow.team,
                  },
                },
              },
              season: {
                connect: {
                  name: season,
                },
              },
            },
            create: {
              driver: {
                connectOrCreate: {
                  where: {
                    name: rankRow.driver,
                  },
                  create: {
                    name: rankRow.driver,
                    nationality: 'unknown',
                  },
                },
              },
              team: {
                connectOrCreate: {
                  where: {
                    name: rankRow.team,
                  },
                  create: {
                    name: rankRow.team,
                  },
                },
              },
              season: {
                connect: {
                  name: season,
                },
              },
            },
          });

          await prisma.race.upsert({
            where: {
              seasonName_grandPrix: {
                seasonName: season,
                grandPrix: grandPrix,
              },
            },
            update: {
              title,
              grandPrix: grandPrix,
              date: new Date(date),
              circuit,
              season: {
                connect: {
                  name: season,
                },
              },
            },
            create: {
              title,
              grandPrix: grandPrix,
              date: new Date(date),
              circuit,
              season: {
                connect: {
                  name: season,
                },
              },
            },
          });

          await prisma.ranking.upsert({
            where: {
              driverName_grandPrix_seasonName: {
                driverName: rankRow.driver,
                grandPrix: grandPrix,
                seasonName: season,
              },
            },
            update: {
              points: rankRow.points,
              position: rankRow.position,
              laps: rankRow.laps,
              time: rankRow.time,
              // grandPrix: grandPrix,
              // seasonName: season,
              // driverName: rankRow.driver,
              driver: {
                connect: {
                  name: rankRow.driver,
                },
              },
              race: {
                connect: {
                  seasonName_grandPrix: {
                    seasonName: season,
                    grandPrix: grandPrix,
                  },
                },
              },
            },
            create: {
              points: rankRow.points,
              position: rankRow.position,
              laps: rankRow.laps,
              time: rankRow.time,
              // grandPrix: grandPrix,
              // seasonName: season,
              // driverName: rankRow.driver,
              driver: {
                connect: {
                  name: rankRow.driver,
                },
              },
              race: {
                connect: {
                  seasonName_grandPrix: {
                    seasonName: season,
                    grandPrix: grandPrix,
                  },
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
