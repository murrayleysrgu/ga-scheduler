
const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { parse, format, parseISO } = require('date-fns');

const rows = [];
export default async function handler(req, res) {
    if (req.method == 'POST') {
fs.createReadStream('./src/imports/PersonDailyActivityDetail.csv')
  .pipe(csv())
  .on('headers', () => {
    // Skip the headers row
  })
  .on('data', async (row) => {
    try {
      // Here, you can manipulate the row data or perform any necessary validations
        const dateString = row['Date']; // Assuming 'Date' is the column name in the CSV file
        const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
        const formattedDate = parseISO(format(parsedDate, 'yyyy-MM-dd'));


      // Create or update a record in the database using Prisma
      await prisma.Availability.create({
        data: {
          // Map the CSV row fields to the corresponding Prisma model fields
            resource_id: row['﻿Payroll No.'],
            job_name: row['Activity'],
            availability_date: formattedDate,
            available_hrs: parseInt(row['Hours']) ,
            created_at:new Date(),
            updated_at:new Date(),
        },
      });


    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'failed to upload resources' });
    }
  })
  .on('end', () => {

    prisma.$disconnect(); // Disconnect from the Prisma client
    console.log('CSV file successfully processed');
    res.status(200).json({ message: 'success resources uploaded to database' });
  });

    

    } else {
        res.status(405).json({ message: ' not allowed' });
    }
}
