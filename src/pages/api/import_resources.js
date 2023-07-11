const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
let import_error = false;

const workshop = ['ELEC','FAB','HYD','MECH','M/C','NDT','P&M','PAINT'];
export default async function handler(req, res) {
    if (req.method == 'POST') {
        fs.createReadStream('./src/imports/resources.csv')
          .pipe(csv())
          .on('headers', () => {
            // Skip the headers row
          })
          .on('data', async (row) => {
            try {
              // Here, you can manipulate the row data or perform any necessary validations
             const workshop_index = workshop.indexOf(row['Workshop']);
                if (workshop_index !== -1) {
              

              // Create or update a record in the database using Prisma
              await prisma.Resource.create({
                data: {
                  // Map the CSV row fields to the corresponding Prisma model fields
                    id: row['Sparrows ID'],
                    resource_name: row['﻿Name'],
                    created_at:new Date(),
                    updated_at:new Date(),
                    resource_role: row['Role'],
                    resource_skill: row['Skills'],
                    resource_workshop: workshop_index,

                },
              });}
                } catch (error) {
                    console.error(error);
                    import_error = true;
                    res.status(500).json({ message: 'error' });
            }
          })
          .on('end', () => {
            prisma.$disconnect(); // Disconnect from the Prisma client
            console.log('CSV file successfully processed');
            if (import_error === false) {
            res.status(200).json({ message: 'success resources uploaded to database' });
            } else {
                res.status(500).json({ message: 'error' });
            }
          });
    } else {
        res.status(405).json({ message: ' not allowed' });
    }
}
