const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { parse, format, parseISO } = require('date-fns');


const dateString = 'Fri 16/06/23';
const parsedDate = parse(dateString, 'EEE dd/MM/yy', new Date());
const formattedDate = format(parsedDate, 'yyyy-MM-dd');
const workshop = ['ELEC','FAB','HYD','MECH','M/C','NDT','P&M','PAINT'];

function addWorkingDays(startDate, numDays) {
  const currentDate = new Date(startDate);
  let addedDays = 0;

  while (addedDays < numDays) {
    currentDate.setDate(currentDate.getDate() + 1);

    // Check if the current day is a weekend (Saturday or Sunday)
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      continue; // Skip weekends
    }

    // Check if the current day is a holiday (add your custom logic here)
    // if (isHoliday(currentDate)) {
    //   continue; // Skip holidays
    // }

    addedDays++;
  }

  return currentDate;
}

let start_date = new Date();
let days = [0,0,0,0,0,0,0];

fs.createReadStream('./src/plan_export -  original.csv')
  .pipe(csv())
  .on('headers', () => {
    // Skip the headers row
  })
  .on('data', async (row) => {
    try {
      // Here, you can manipulate the row data or perform any necessary validations
        const dateString = row['Deadline']; // Assuming 'Date' is the column name in the CSV file
        const parsedDate = parse(dateString, 'EEE dd/MM/yy', new Date());
        const formattedDate = parseISO(format(parsedDate, 'yyyy-MM-dd'));
        let job_days = Math.ceil(parseInt(row['CTR Hours'])/8);
        if (job_days === 0) {
            job_days = 1;
        }
        let workshop_index = workshop.indexOf(row['Workshop']);
        let st_days = days[workshop_index];
        days[workshop_index] = days[workshop_index] + job_days;
        const deadline = addWorkingDays(start_date, days[workshop_index]-1);
        console.log('deadline:::', deadline, row['CTR Hours'],days,workshop_index);
      // console.log(row['﻿ID']);
      // console.log(row); 
      // Create or update a record in the database using Prisma
      await prisma.job_cards.create({
        data: {
          // Map the CSV row fields to the corresponding Prisma model fields
            id: row['﻿ID'],
            job_number: row['Job Number'],
            card_number: row['Card No.'],
            job_workshop: row['Workshop'],
            job_name: row['Task Name'],
            due_date: formattedDate,
            created_at:new Date(),
            updated_at:new Date(),
            job_status: "",
            job_contact: row['Client'],
            job_ctr: row['CTR Hours'],
            ctr: job_days,
            job_resources: row['Resources'],
            start_date: addWorkingDays(start_date, st_days),
            end_date: deadline,
            job_order: 0,
        },
      });
    } catch (error) {
      console.error(error);
    }
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
    prisma.$disconnect(); // Disconnect from the Prisma client
  });

